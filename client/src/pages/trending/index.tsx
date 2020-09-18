import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import styles from './index.less';
import { MenuOutlined, GithubFilled, StarOutlined, BranchesOutlined, CheckOutlined } from '@ant-design/icons';
import { Radio, Input, List, Spin, Form } from 'antd';
import { Modal} from 'antd-mobile';
import { connect, Dispatch, TrendingStateType } from 'umi';
import { ConnectState } from '@/models/connect';
import QueueAnim from 'rc-queue-anim';
import debounce from 'lodash.debounce';
import Loading from '@/component/loading';
import useResponsive, { setResponsiveConfig } from '@/hooks/useResponsive';

const options = [
  { label: 'Repositories', value: 'repositories' },
];


const languages = ["C#","CSS","HTML","JavaScript","TypeScript","Unknown languages","1C Enterprise","4D","ABAP","ABNF","ActionScript","Ada","Adobe Font Metrics","Agda","AGS Script","AL Code","Alloy","Alpine Abuild","Altium Designer","AMPL","AngelScript","Ant Build System","ANTLR","ApacheConf","Apex","API Blueprint","APL","Apollo Guidance Computer","AppleScript","Arc","AsciiDoc","ASL","ASN.1","Classic ASP","ASP.NET","AspectJ","Assembly","Asymptote","ATS","Augeas","AutoHotkey","AutoIt","Awk","Ballerina","Batchfile","Befunge","BibTeX","Bison","BitBake","Blade","BlitzBasic","BlitzMax","Bluespec","Boo","Brainfuck","Brightscript","Zeek","C","C++","C-ObjDump","C2hs Haskell","Cabal Config","Cap'n Proto","CartoCSS","Ceylon","Chapel","Charity","ChucK","Cirru","Clarion","Classic ASP","Clean","Click","CLIPS","Clojure","Closure Templates","Cloud Firestore Security Rules","CMake","COBOL","CodeQL","CoffeeScript","ColdFusion","ColdFusion CFC","COLLADA","Common Lisp","Common Workflow Language","Component Pascal","CoNLL-U","Cool","Coq","Cpp-ObjDump","Creole","Crystal","CSON","Csound","Csound Document","Csound Score","CSV","Cuda","cURL Config","CWeb","Cycript","Cython","D","D-ObjDump","Dafny","Darcs Patch","Dart","DataWeave","desktop","Dhall","Diff","DIGITAL Command Language","dircolors","DirectX 3D File","DM","DNS Zone","Dockerfile","Dogescript","DTrace","Dylan","E","Eagle","Easybuild","EBNF","eC","Ecere Projects","ECL","ECLiPSe","EditorConfig","Edje Data Collection","edn","Eiffel","EJS","Elixir","Elm","Emacs Lisp","EmberScript","EML","EQ","Erlang","F#","F*","Factor","Fancy","Fantom","Faust","FIGlet Font","Filebench WML","Filterscript","fish","FLUX","Formatted","Forth","Fortran","Fortran Free Form","FreeMarker","Frege","Futhark","G-code","Game Maker Language","GAML","GAMS","GAP","GCC Machine Description","GDB","GDScript","GEDCOM","Genie","Genshi","Gentoo Ebuild","Gentoo Eclass","Gerber Image","Gettext Catalog","Gherkin","Git Attributes","Git Config","GLSL","Glyph","Glyph Bitmap Distribution Format","GN","Gnuplot","Go","Golo","Gosu","Grace","Gradle","Grammatical Framework","Graph Modeling Language","GraphQL","Graphviz (DOT)","Groovy","Groovy Server Pages","Hack","Haml","Handlebars","HAProxy","Harbour","Haskell","Haxe","HCL","HiveQL","HLSL","HolyC","HTML+Django","HTML+ECR","HTML+EEX","HTML+ERB","HTML+PHP","HTML+Razor","HTTP","HXML","Hy","HyPhy","IDL","Idris","Ignore List","IGOR Pro","Inform 7","INI","Inno Setup","Io","Ioke","IRC log","Isabelle","Isabelle ROOT","J","Jasmin","Java","Java Properties","Java Server Pages","JavaScript+ERB","JFlex","Jison","Jison Lex","Jolie","JSON","JSON with Comments","JSON5","JSONiq","JSONLD","Jsonnet","JSX","Julia","Jupyter Notebook","Kaitai Struct","KiCad Layout","KiCad Legacy Layout","KiCad Schematic","Kit","Kotlin","KRL","LabVIEW","Lasso","Latte","Lean","Less","Lex","LFE","LilyPond","Limbo","Linker Script","Linux Kernel Module","Liquid","Literate Agda","Literate CoffeeScript","Literate Haskell","LiveScript","LLVM","Logos","Logtalk","LOLCODE","LookML","LoomScript","LSL","LTspice Symbol","Lua","M","M4","M4Sugar","Macaulay2","Makefile","Mako","Markdown","Marko","Mask","Mathematica","MATLAB","Maven POM","Max","MAXScript","mcfunction","MediaWiki","Mercury","Meson","Metal","Microsoft Developer Studio Project","MiniD","Mirah","mIRC Script","MLIR","Modelica","Modula-2","Modula-3","Module Management System","Monkey","Moocode","MoonScript","Motorola 68K Assembly","MQL4","MQL5","MTML","MUF","mupad","Muse","Myghty","nanorc","NASL","NCL","Nearley","Nemerle","nesC","NetLinx","NetLinx+ERB","NetLogo","NewLisp","Nextflow","Nginx","Nim","Ninja","Nit","Nix","NL","NPM Config","NSIS","Nu","NumPy","ObjDump","Object Data Instance Notation","Objective-C","Objective-C++","Objective-J","ObjectScript","OCaml","Odin","Omgrofl","ooc","Opa","Opal","Open Policy Agent","OpenCL","OpenEdge ABL","OpenQASM","OpenRC runscript","OpenSCAD","OpenStep Property List","OpenType Feature File","Org","Ox","Oxygene","Oz","P4","Pan","Papyrus","Parrot","Parrot Assembly","Parrot Internal Representation","Pascal","Pawn","Pep8","Perl","PHP","Pic","Pickle","PicoLisp","PigLatin","Pike","PlantUML","PLpgSQL","PLSQL","Pod","Pod 6","PogoScript","Pony","PostCSS","PostScript","POV-Ray SDL","PowerBuilder","PowerShell","Prisma","Processing","Proguard","Prolog","Propeller Spin","Protocol Buffer","Public Key","Pug","Puppet","Pure Data","PureBasic","PureScript","Python","Python console","Python traceback","q","Q#","QMake","QML","Qt Script","Quake","R","Racket","Ragel","Raku","RAML","Rascal","Raw token data","RDoc","Readline Config","REALbasic","Reason","Rebol","Red","Redcode","Regular Expression","Ren'Py","RenderScript","reStructuredText","REXX","Rich Text Format","Ring","Riot","RMarkdown","RobotFramework","Roff","Roff Manpage","Rouge","RPC","RPM Spec","Ruby","RUNOFF","Rust","Sage","SaltStack","SAS","Sass","Scala","Scaml","Scheme","Scilab","SCSS","sed","Self","ShaderLab","Shell","ShellSession","Shen","Sieve","Slash","Slice","Slim","Smali","Smalltalk","Smarty","SmPL","SMT","Solidity","SourcePawn","SPARQL","Spline Font Database","SQF","SQL","SQLPL","Squirrel","SRecode Template","SSH Config","Stan","Standard ML","Starlark","Stata","STON","Stylus","SubRip Text","SugarSS","SuperCollider","Svelte","SVG","Swift","SWIG","SystemVerilog","Tcl","Tcsh","Tea","Terra","TeX","Texinfo","Text","Textile","Thrift","TI Program","TLA","TOML","TSQL","TSX","Turing","Turtle","Twig","TXL","Type Language","Unified Parallel C","Unity3D Asset","Unix Assembly","Uno","UnrealScript","UrWeb","V","Vala","VBA","VBScript","VCL","Verilog","VHDL","Vim script","Vim Snippet","2Visual Basic .NET","Volt","Vue","Wavefront Material","Wavefront Object","wdl","Web Ontology Language","WebAssembly","WebIDL","WebVTT","Wget Config","Windows Registry Entries","wisp","Wollok","World of Warcraft Addon Data","X BitMap","X Font Directory Index","X PixMap","X10","xBase","XC","XCompose","XML","XML Property List","Xojo","XPages","XProc","XQuery","XS","XSLT","Xtend","Yacc","YAML","YANG","YARA","YASnippet","ZAP","Zeek","ZenScript","Zephir","Zig","ZIL","Zimpl"];
const dates = ['today', 'week', 'month'];

const mapStateToProps = ({ trending, loading }: ConnectState) => ({
  data: trending.data,
  loading: loading.effects['trending/fetch'] || loading.effects['trending/fetchLanguage'],
});

type DateType = 'Today' | 'This week' | 'This month';
type SinceType = 'daily' | 'weekly' | 'monthly';
type DateParamType = 'today' | 'week' | 'month';

interface TrendingProps extends TrendingStateType {
  dispatch: Dispatch;
  loading?: boolean;
} 
setResponsiveConfig({
  isPc: 1200,
});

const Trending: React.FC<TrendingProps> = (props) => {
  const [ language, setLanguage ] = useState('Any');
  const [ dateIndex, setDateIndex ] = useState(0);
  const [ showAnim, setShowAnim ] = useState(true);
  const [ languagesList, setLanguages ] = useState(languages);
  const [ showPanel, setShowPanel ] = useState(false); 
  const [ touchMove, setTouchMove ] = useState(true);
  const searchRef = useRef<Input>(null);
  
  useEffect(() => {
    const { dispatch, data } = props;
    if (!data.Any.today.length) {
      dispatch({
        type: 'trending/fetch'
      });
    }
  }, []);

  const isPc = useResponsive();
  console.log(isPc)

  const [ languageModal, setLanguageModal ] = useState(false);
  const [ dateModal, setDateModal ] = useState(false);
  useEffect(() => {
    if (languageModal || dateModal) {
      setTouchMove(false);
    } else {
      setTouchMove(true);
    }
  }, [ languageModal, dateModal ]);

  function getDate(index: number):DateType {
    switch(index) {
      case 0:
        return 'Today';
      break;
      case 1:
        return 'This week';
      break;
      case 2:
        return 'This month';
      break;
      default:
        return 'Today';
    }
  }

  function getSince(index: number): SinceType {
    switch(index) {
      case 0:
        return 'daily';
      break;
      case 1:
        return 'weekly';
      break;
      case 2:
        return 'monthly';
      break;
      default:
        return 'daily';
    }
  }

  function dateChange(index: number) {
    const { dispatch, data } = props;
    if (index !== dateIndex) {
      setDateModal(false);
      setShowAnim(true);
      if (!(data[language][dates[index] as DateParamType]).length) {
        dispatch({
          type: 'trending/fetchLanguage',
          payload: {
            language,
            since: getSince(index),
          },
        });
      }
      setDateIndex(index);
    }
  }

  function languageChange(lang: string) {
    const { dispatch, data } = props;
    setLanguageModal(false);
    setShowAnim(true);
    if (!data[lang]) {
      dispatch({
        type: 'trending/fetchLanguage',
        payload: {
          language: lang,
          since: getSince(dateIndex),
        },
      });
    }
    setLanguage(lang);
  }

  const filterChange = debounce((value: string) => {
    const filterList = languages.filter(lang => lang.toLowerCase().includes(value));
    setLanguages(filterList);
  }, 300)

  function TrendingList() {
    if(props.loading) {
      return (
        <Loading />
      )
    }
    if(props.data[language]) {
      const list = props.data[language][dates[dateIndex] as DateParamType];
      const items = list.map((item, index) => (
        <li onClick={() => location.assign(item.link)} key={index + item.project}>
          <h3>
            <svg color="gray" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true">
              <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z">
              </path>
            </svg>
            <a>
              <span>{item.author} / </span>
              {item.project}
            </a>
          </h3>
          <p>{item.description}</p>
          <div className={styles.info}>
            {item.language && (
              <div className={styles.type}>
                <span className={styles.cycle}></span>
                <span>{item.language}</span>
              </div>
            )}
            <div className={styles.star}>
              <StarOutlined />
              <span>{item.stars}</span>
            </div>
            <div className={styles.branch}>
              <BranchesOutlined />
              <span>{item.branch}</span>
            </div>
            <div className={styles.star}>
              <StarOutlined />
              <span>{item.star_today}</span>
            </div>
          </div>
        </li>
      ));
      return (
        <QueueAnim
          type={['right', 'left']}
        >
          <ul 
            key={(!dateModal && !languageModal && showAnim) ? 'ul' :undefined}
          >
            {items}
          </ul>
        </QueueAnim>
      )
    }
    return null;
  }

  function handleSearch({search}:any) {
    if (search) {
      const input = searchRef.current as Input;
      input.blur();
      Modal.alert('This action will jump to Github.', 'Are you sure?', [
        { text: 'Cancel', style: 'default', onPress() {} },
        { text: 'Got it', onPress(){location.assign(`https://github.com/search?q=${search}`)} },
      ]);
    }
  }

  return (
    <div className={styles.trending} onTouchMove={ev => {!touchMove && ev.stopPropagation()}}>
      <QueueAnim component="header" type={['right', 'left']}>
        <MenuOutlined onClick={() => {setShowAnim(false);setShowPanel(bool => !bool)}} key="menu" className={styles.menu} />
        <div key="title" className={styles.title}>
          <GithubFilled className={styles.github} />
        </div>
      </QueueAnim>
      {showPanel && (
        <QueueAnim 
          className={styles.headerPanel}
          type={['bottom', 'top']}
        >
          <Form key="form" onFinish={handleSearch}>
            <Form.Item name="search">
              <Input ref={searchRef} autoComplete="off" key="search" type="search" className={styles.search} placeholder="Search" />
            </Form.Item>
          </Form>
        </QueueAnim>
      )}
      <div className={styles.main} key="main">
        <QueueAnim className={styles.title} 
          component="div" 
          type={['right', 'left']}
          delay={100}
        >
          <h1 key="title">Trending</h1>
          <p key="description">See what the GitHub community is most excited about {getDate(dateIndex)}.</p>
        </QueueAnim>
        <QueueAnim 
          className={styles.action}
          type={['right', 'left']}
          delay={250}
        >
          <Radio.Group
            buttonStyle="solid"
            options={options}
            value="repositories"
            optionType="button"
            key="category"
          />  
          <div key="language" className={styles.language}>
            Language: <span onClick={() => {setLanguageModal(true);setShowAnim(false)}} className={styles.selection}>{language} </span>
          </div>
          <div key="range" className={styles.range}>
            Date Range: <span onClick={() => {setDateModal(true);setShowAnim(false)}} className={styles.selection}>{getDate(dateIndex)} </span>
          </div>
        </QueueAnim>
        <TrendingList key="trendingList" />
      </div>
      <Modal
        onClose={() => {setLanguageModal(false);setLanguages(languages)}}
        visible={languageModal}
        className={styles.languageModal}
        closable={true}
        transparent
        title={(
          <h4>Select a spoken language</h4>
        )}
      >
        <List
          className={styles.modalList}
          header={(
            <Input onChange={(ev) => filterChange(ev.target.value)} placeholder="Filter languages" />
          )}
          dataSource={languagesList}
          renderItem={item => (
            <List.Item className={language === item ? styles.active : undefined} onClick={(ev) => {languageChange(item);setLanguages(languages);}}>
              {language === item && (<CheckOutlined />)}
              {item}
            </List.Item>
          )}
        />
      </Modal>
      <Modal
        onClose={() => {setDateModal(false)}}
        visible={dateModal}
        className={styles.dateModal}
        closable={true}
        transparent
        title={(
          <h4>Adjust time span</h4>
        )}
      >
        <List
          header={false}
          dataSource={dates}
          renderItem={(item, index) => (
            <List.Item className={index === dateIndex ? styles.active : undefined} onClick={() => dateChange(index)}>
              {index === dateIndex && (<CheckOutlined />)}
              {getDate(index)}
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
}


export default connect(mapStateToProps)(Trending);
