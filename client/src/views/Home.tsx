//@ts-ignore
import { useState, useEffect, useRef } from 'react';
//@ts-ignore
import Card from '../components/Card';
import '../styles/Home.css';
import '../styles/Constants.css';
import mainPicture from '../resources/mainPicture.jpg';
import isLoggedIn from '../utils/isLoggedIn';
import logo from '../resources/logo.png';
//@ts-ignore
import { Link } from 'react-router-dom';
//@ts-ignore
import { Redirect } from 'react-router-dom';

//@ts-ignore
import firstVid from '../resources/firstVid.mp4';
//@ts-ignore
import secondVid from '../resources/secondVid.mp4';
//@ts-ignore
import thirdVid from '../resources/thirdVid.mp4';
import CONSTANTS from '../constants/api';
import AUTH_CONSTANTS from '../constants/auth';




const cards = [
    { value: 'Scholarly Tone', hoverText: 'Compose a significantly more potent communication in a fraction of the duration' },
    { value: 'Professional Tone', hoverText: 'Draft a message with greater impact within a reduced time frame' },
    { value: 'Broaden Vocab', hoverText: 'Compose a message of heightened effect within a truncated timeframe' },
    { value: 'Active Voice', hoverText: 'Write with greater impact in half the time' },
    { value: 'Vivid Descriptions', hoverText: 'Craft a message that packs twice the punch in mere minutes' },
    { value: 'Shorten It', hoverText: 'Write a more impactful message quickly' },
    { value: 'Lengthen It', hoverText: 'Write a message that leaves a greater impact and makes a stronger impression in less time' },
];


const Home = () => {
    const [typeWriterText, setTypeWriterText] = useState<string>('Write a more impactful message in half the time');
    const [currentTypeWriteText, setCurrentTypewriterText] = useState<string>('Write a more impactful message in half the time');
    const [redirect, setRedirect] = useState<boolean>(false);

    const constFirstVideoRef = useRef<HTMLVideoElement>(null);
    const constSecondVideoRef = useRef<HTMLVideoElement>(null);
    const constThirdVideoRef = useRef<HTMLVideoElement>(null);

    //@ts-ignore
    const playFirstVideo = () => { constFirstVideoRef.current.playbackRate = 0.5 };
    //@ts-ignore
    const playSecondVideo = () => { constSecondVideoRef.current.playbackRate = 0.5 };
    //@ts-ignore
    const playThirdVideo = () => { constThirdVideoRef.current.playbackRate = 0.5 };


    const resetTypeWriter = () => {
        setTypeWriterText('Write a more impactful message in half the time');
        setCurrentTypewriterText('Write a more impactful message in half the time');
    };


    useEffect(() => {
        isLoggedIn().then((isAuthenticated: Boolean) => {
            if (isAuthenticated) {
                //@ts-ignore
                setRedirect(true);
            }
        });
    }, []);
    //create a timer that gets called every 100ms and is responsible for updating the currenttypewriter text letter by letter until it matches the typewriter text
    useEffect(() => {
        const timer = setInterval(() => {
            if (currentTypeWriteText.length < typeWriterText.length) {
                //log the typeWriterText up to the current length
                setCurrentTypewriterText(typeWriterText.slice(0, currentTypeWriteText.length) + typeWriterText[currentTypeWriteText.length]);
            }
        }, 55);
        return () => clearInterval(timer);
    }, [currentTypeWriteText, typeWriterText]);

    const onHover = (bigText: string) => {
        if (bigText !== typeWriterText) {
            setTypeWriterText(bigText);
            setCurrentTypewriterText(bigText[0]);
        }
    }

    if (redirect) {
        return <Redirect to="/dashboard" />
    }

    // <Link to="/login" id="login">Log in</Link>
    // <Link to="/sign-up" id="register">Sign Up</Link>
    return (

        <div className="Home-body">
            <div className="home-header">
                <div className="home-headerLeft">
                    <img src={logo} className="app-logo" alt="logo" />
                    <h1>wordsmith</h1>
                </div>
                <div className="home-headerRight">
                    <Link className="button2 loginRight" to="/signin" id="login">Log in</Link>
                    <a href={CONSTANTS.CHROME_LINK} target='_blank' className="button1 button1Small">
                        Add to Chrome
                    </a>
                </div>
            </div>
            <div className="home-firstBigChunk">
                <div className="home-firstBigChunkMargin">
                    <div className="home-mainTextSection">
                        <h1 className='home-rotatingH1'>Wordsmith helps you </h1>
                        <div className="home-rotatingTextSection">
                            <h1 className='home-rotatingH1'>write</h1>
                            <b className='home-b'>
                                <div className="innerIam">
                                    concisely<br />
                                    scholarly<br />
                                    vividly<br />
                                    professionally<br />
                                    intelligently
                                </div>
                            </b>
                        </div>
                        <p>Write more and spend less time reviewing for mistakes</p>
                        <a href={CONSTANTS.CHROME_LINK} target='_blank' className="home-addToChrome button1">Add to Chrome - it's Free</a>
                    </div>
                    <img src={mainPicture} alt="mainPicture" className="home-mainPicture" />
                </div>
            </div>



            <div className="home-secondChunk">
                <div className="custom-shape-divider-top-1674139824">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
                    </svg>
                </div>

                <div className="home-secondChucnk-mainContent">
                    <div className="row firstRow">
                        <div className='video-div'>
                            {/* @ts-ignore */}
                            <video className='video'
                                loop muted autoPlay
                                ref={constFirstVideoRef} onCanPlay={() => { playFirstVideo() }}>
                                <source src={firstVid} type="video/mp4" />
                            </video></div>
                        <div className='text'>
                            <h3>First, highlight any text you wrote</h3>
                            <p>Wordsmith works with just about anywhere you can write text on the web. I'm currently trying to add functionality for Google Docs.</p>
                        </div>
                    </div>
                    <div className="row secondRow">
                        <div className='text'>
                            <h3>Select your changes</h3>
                            <p>You can choose between applying a scholarly tone, a professional tone, broadening your vocab, using an active voice, adding vivid details, shortening it, or making it longer.</p>
                        </div>
                        <div className='video-div'>
                            {/* @ts-ignore */}
                            <video className='video'
                                loop muted autoPlay
                                ref={constSecondVideoRef} onCanPlay={() => { playSecondVideo() }}>
                                <source src={secondVid} type="video/mp4" />
                            </video></div>
                    </div>
                    <div className="row thirdRow">
                        <div className='video-div'>
                            {/* @ts-ignore */}
                            <video className='video'
                                loop muted autoPlay
                                ref={constThirdVideoRef} onCanPlay={() => { playThirdVideo() }}>
                                <source src={thirdVid} type="video/mp4" />
                            </video></div>
                        <div className='text'>
                            <h3>Finally, watch the <span className='magicalSpan'>magic</span> unfold</h3>
                            <p>Our GPT-powered AI will help you craft the perfect message, helping your writing convey the right message to your audience.</p>
                        </div>
                    </div>
                </div>

                <div className="custom-shape-divider-bottom-1674142105">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
                    </svg>
                </div>

            </div>


            <div className="home-thirdChunk">
                <div className="home-thirdChunkMargin">
                    <h1 className='home-thirdChunkText-h1'>Try seven different version of the same sentence</h1>
                    <h4 className='home-thirdChunkText-h4'>{currentTypeWriteText}</h4>
                    <div className="home-thirdChunkCards" onMouseLeave={resetTypeWriter}>
                        {cards.map((card, index) => {
                            return (
                                <Card key={index} title={card.value} bigText={card.hoverText} onHover={onHover} />
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="home-footer">
                <div className="custom-shape-divider-bottom-1674142871">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
                    </svg>
                </div>
                <div className="home-footer-content">
                    <div className="home-footer-right">
                        <Link className="home-bottomLink" to="/resources" id="login">Resources</Link>
                        <a href='https://www.patrickrfoster.com' className="home-bottomLink" target="_blank">About</a>
                        <p className='home-bottomLink'>patrick.123.foster@gmail.com</p>
                    </div>
                    <h1>Try Wordsmith today</h1>
                </div>
            </div>
        </div>
    );
};

export default Home;