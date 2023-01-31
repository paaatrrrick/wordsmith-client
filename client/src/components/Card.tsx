//setup interface for props
import '../styles/Card.css'

import scholar from '../resources/scholar.svg';
import proff from '../resources/proff.svg';
import voab from '../resources/voab.svg';
import active from '../resources/active.svg';
import vivid from '../resources/vivid.svg';
import backwards from '../resources/backwards.svg';
import forward from '../resources/forward.svg';

const valueToImg = {
    'Scholarly Tone': scholar,
    'Professional Tone': proff,
    'Broaden Vocab': voab,
    'Active Voice': active,
    'Vivid Descriptions': vivid,
    'Shorten It': backwards,
    'Lengthen It': forward,
}

interface CardProps {
    title: string;
    onHover: (bigText: string) => void;
    bigText: string;
}


const Card = (props: CardProps) => {
    const { title, onHover, bigText } = props;
    //@ts-ignore
    const mainPicture = valueToImg[title];

    return (
        <div onMouseOver={() => { onHover(bigText) }} className="card">
            <img className='card-img' src={mainPicture} alt={title} />
            <h5 className="card-title">{title}</h5>
        </div>
    )
}

export default Card;