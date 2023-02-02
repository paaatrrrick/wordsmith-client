//@ts-ignore
import { Link } from 'react-router-dom';

const Privacypolicy = () => {
    return (
        <div className='Resources'>
            <Link to="/" className="button1 Resources-button">Home</Link>
            <h1>Privacy Policy</h1>
            <p className='resourcesA' style={{ maxWidth: "80vw", lineHeight: '55px' }}>
                Wordsmith Privacy Policy

                Wordsmith is a Chrome extension for improving the writing of users. This extension is free to download and use.

                Wordsmith does not collect any data from its users. We do not receive or store any personal information from our users. No data is collected, stored, or shared by Wordsmith.

                We have no access to any of the content that is written by users. Wordsmith is solely a tool to improve the user's writing, and as such, we do not have access to the content that is written.

                We use only necessary permissions in order to provide our service. We do not store any of the data that is accessed through these permissions.

                We are committed to protecting the privacy of our users. If you have any questions or concerns about our privacy policy, please feel free to contact us.
            </p>
        </div>
    );
};

export default Privacypolicy;