import React,{ useEffect, useState, useRef, VideoHTMLAttributes } from 'react';
import { Button,Checkbox, Input, message } from 'antd';
import styles from './index.css';
import io from 'socket.io-client';
import 'webrtc-adapter';

const roomId = 'hiro\'s room';


export default function() {
    
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const [ socket, setSocket ] = useState<SocketIOClient.Socket>();
  const [ leaveDisabled, setLeaveDisable ] = useState(true);
  const [ offerValue, setOfferValue] = useState('');
  const [ answerValue, setAnswerValue] = useState('');

  const pcConfig = {
    iceServers: [{
      urls: 'turn:hiro.cn:3478', // 本地运行需要修改host, 本地https证书
      credential: '123456',
      username: 'hiro'
    }]
  }  

  const [localAllStream,setLocalAllStream] = useState<MediaStream|null>(null);
  const [localVideoStream,setLocalVideoStream] = useState<MediaStream|null>(null);
  useEffect(() => {
    if(localVideoStream){
      localAllStream?.getAudioTracks().forEach(track => {
        localVideoStream?.addTrack(track);
      });
      playLocal(localVideoStream);
    }else{
      playLocal(localAllStream as MediaStream);
    }
    
    if (localAllStream) {
      console.log('connect socket server')
      connectIo();
    }
  }, [localAllStream])
  

  let constraints:MediaStreamConstraints
  const [shareChecked,setshareChecked] = useState(true);
  const [btnConnDisabled,setConnDisable] = useState(false);
  useEffect(() => {
    if (btnConnDisabled) {
      if (localAllStream) {
        setLocalAllStream(stream => {
          stream?.getTracks().forEach(track => track.stop());
          return null;
        });
      }
      if (localVideoStream) {
        setLocalVideoStream(stream => {
          stream?.getTracks().forEach(track => track.stop());
          return null;
        });
      }
      if (shareChecked && isPc()) {
        navigator.mediaDevices.getDisplayMedia({
          video: true
        })
        .then((stream:MediaStream) => {
          setLocalVideoStream(stream);
        })
        .catch(handleError);
  
        constraints = {
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        }
      } else {
        constraints = {
          video: {
            width: 640,
            height: 480
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        };
      }
      navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        setLocalAllStream(stream);
      })
      .catch(handleError);
    }
  },[btnConnDisabled, shareChecked]);


  const [ status, setStatus ] = useState('');
  const [ peerConnection, setPeerConnection] = useState<RTCPeerConnection>();
  const [ messageData, setMessageData ] = useState<any>(null);


  useEffect(() => {
    if (status === 'joined') {
      createPeerConnection();
    }

    if (status === 'joined_unbind') {
      createPeerConnection();
      bindTracks(peerConnection as RTCPeerConnection);
    }

    if (status === 'joined_conn') {
      const offerOptions:RTCOfferOptions  = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      }
      console.log('createOffer')
      peerConnection?.createOffer(offerOptions)
        .then((desc) => {
          peerConnection.setLocalDescription(desc);
          setOfferValue(desc.sdp as string);
          socket?.emit('message', roomId, desc);
        })
        .catch(err => {
          console.error(err)
        });
    }

    if (status === 'offer received') {
      peerConnection?.setRemoteDescription(new RTCSessionDescription(messageData));
      console.log('offer received');
      console.log('create answer');
      peerConnection?.createAnswer()
        .then((desc) => {
          peerConnection.setLocalDescription(desc);
          setAnswerValue(desc.sdp as string);
          socket?.emit('message', roomId, desc)
        })
        .catch(err => {
          console.error(err);
        });
    }
    
    if (status === 'answer received') {
      console.log('answer received');
      setAnswerValue(messageData.sdp);
      peerConnection?.setRemoteDescription(new RTCSessionDescription(messageData));
    }

    if (status === 'candidate received') {
      const candidate = new RTCIceCandidate({
        sdpMLineIndex: messageData.label,
        candidate: messageData.candidate,
      });
      peerConnection?.addIceCandidate(candidate);
    }
  },[ status ]);


  const [ remoteStream, setRemoteStream ] = useState<MediaStream>();
  useEffect(() => {
    if (remoteStream) {
      playRemote(remoteStream as MediaStream)
    }
  }, [ remoteStream ]);



  function playLocal(stream:MediaStream,ev?:MediaStreamTrackEvent) {
    const video = localVideo.current as HTMLVideoElement;
    video.srcObject = stream;
  }
  
  function playRemote(stream:MediaStream,ev?:MediaStreamTrackEvent) {
    const video = remoteVideo.current as HTMLVideoElement;
    video.srcObject = stream;
  }

  function connectIo() {
    const socket = io('https://hiro.cn:8443');

    socket.on('connect', () => {
      console.log('socket connected')
    });

    socket.on('joined', (room:string, id:string) => {
      console.log('receive joined message!', room, id);
      setConnDisable(true);
      setLeaveDisable(false);
      setStatus('joined');
    });
    
    socket.on('otherjoin', (room:string, id:string) => {
      console.log('receive joined message!', room, id);
      setStatus('joined_conn');
    });

    socket.on('message', (room:string, data:any) => {
      if (data.type && data.type === 'offer') {
        setMessageData(data);
        setOfferValue(data.sdp);
        setStatus('offer received');
      } else if (data.type && data.type === 'answer') {
        setMessageData(data);
        setAnswerValue(data.sdp);
        setStatus('answer received');
      } else if (data.type && data.type === 'candidate') {
        setMessageData(data);
        setStatus('candidate received');
      } else {
        console.error('invalid message!');
      }
    });

    socket.on('full', () => {

    });

    socket.on('leaved', () => {

    });

    socket.on('bye', () => {

    });

    socket.on('disconnect', () => {

    });

    socket.emit('join', roomId)
    setSocket(socket);
    
  }

  function createPeerConnection() {
    console.log('create RTCPeerConnection');
    if (!peerConnection) {
      const pc = new RTCPeerConnection(pcConfig);
      pc.onicecandidate = (ev:RTCPeerConnectionIceEvent) => {
        console.info('handler onicecandidate emit');
        if (ev.candidate) {
          console.log('socket emit candidate')
          socket?.emit('message',roomId, {
            type: 'candidate',
            label: ev.candidate.sdpMLineIndex,
            id: ev.candidate.sdpMid,
            candidate: ev.candidate.candidate
          });
        } else {
          console.log('this is the end candidate');
        }
      }
      pc.ontrack = (ev) => {
        console.info('handler ontrack emit');
        setRemoteStream(ev.streams[0]);
      }
      bindTracks(pc);
      setPeerConnection(pc);
    } else {
      console.log('the pc have been created')
    }
  }

  function bindTracks(pc:RTCPeerConnection) {
    if (localVideoStream) {
      localVideoStream?.getTracks().forEach(track => {
        pc.addTrack(track, localVideoStream)
      });
    } else {
      localAllStream?.getTracks().forEach(track => {
        pc.addTrack(track, localAllStream)
      });
    }
  }

  function start() {
    if (!isSupportMediaDevices) {
      message.warning('您的浏览器不支持webRTC');
    };
    setConnDisable(true);
  }


  function handleError(err:any) {
    console.error(err);
  }

  function isPc() {
    const ua = navigator.userAgent;
    const mobiles = ['Android', 'iPhone', 'Windows Phone','iPad','iPod']
    let result = true;
    while(mobiles.length){
      if(ua.includes(mobiles[0])){
        result = false;
      }
      mobiles.shift();
    }
    return result;
  }

  function isSupportMediaDevices(){
    return ('getUserMedia' in navigator.mediaDevices) ? true : false;
  }

  function leave() {
    socket?.emit('leave', roomId);
    setOfferValue('');
    setAnswerValue('');
    setConnDisable(false);
    setLeaveDisable(true);
  }
  
  function handup() {
    if (!peerConnection) {
      return;
    }
    peerConnection.close();
    setPeerConnection(undefined);
  }
  
  return (
    <div className={styles.normal}>
      <Button disabled={btnConnDisabled} onClick={start}>Connect Sig Server</Button>
      <Button disabled={leaveDisabled}>Leave</Button>
      <div style={{margin:10}}>
        <Checkbox onChange={(e) => setshareChecked(e.target.checked)} checked={shareChecked}>Share Desktop</Checkbox>
      </div>
      <div>
        <div>
          <h2>Local:</h2>
          <video controls ref={localVideo} style={{width:'100%',height:225}} autoPlay playsInline muted></video>
          <h2>Offer SDP:</h2>
          <Input.TextArea rows={5} value={offerValue} />
        </div>
        <div>
          <h2>Remote:</h2>
          <video controls ref={remoteVideo} style={{width:'100%',height:225}} autoPlay playsInline></video>
          <h2>answer SDP:</h2>
          <Input.TextArea rows={5} value={answerValue} />
        </div>
      </div>
      
    </div>
  );
}
