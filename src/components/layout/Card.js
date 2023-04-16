import React from 'react'
import classes from './Card.module.scss';
const Card = () => {
  return (
    <div className={classes.classCard} style={{ marginRight: 30, marginBottom: 30 }}>
      <div className={classes["classCard__upper"]}>
        <div className={classes["classCard__className"]}>Name</div>
        <div className={classes["classCard__creatorName"]}>Creator</div>
        <img src='https://th.bing.com/th/id/OIP.YHCtUpoNz1wqYbf0d9tIUQHaLO?pid=ImgDet&rs=1' className={classes["classCard__creatorPhoto"]} />
      </div>
      <div className={classes["classCard__middle"]}></div>
      <div className={classes["classCard__lower"]}></div>
    </div>
  )
}

export default Card