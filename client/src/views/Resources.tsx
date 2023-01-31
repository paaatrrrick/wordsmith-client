//@ts-ignore
import { Link } from 'react-router-dom';

const Resources = () => {
    return (
        <div className='Resources'>
            <Link to="/" className="button1 Resources-button">Go Back</Link>
            <h1>Thank you to these artists and their contributions</h1>
            <a className='resourcesA' href="https://www.freepik.com/free-vector/copywriting-social-media-post-content-marketing-internet-commercial-cartoon-character-writing-text-advertising-promotional-strategy-concept-illustration_11668497.htm#query=write&position=21&from_view=author">Image by vectorjuice on Freepik</a>
        </div>
    );
};

export default Resources;