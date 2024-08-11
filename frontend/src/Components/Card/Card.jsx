import React from 'react'
import "./Card.css"
import { Link } from 'react-router-dom'

const Card = ({description, title, link, img=NaN, pres}) => {
  return (
    <div>
    <a href={link} target="_blank" rel="noopener noreferrer" 
    className={"scholarship-card" + (pres ? 'r' : 's')}>
    <div className='image'>
      {pres ? (<img src={img}/>) : (<div></div>)}
      </div>
      <h3>{title}</h3>
      <p>
        {description}
      </p>
      </a>
    </div>
  )
}

export default Card