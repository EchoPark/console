import styles from './ImgPicker.css'

const ChooseButton = props => (
  <div onClick={props.addImg} className={styles.addButton} />
)

const ImgDisplay = props => (
  <div className={styles.imgContainer}>
    <div onClick={props.cancelImg} className={styles.imgRemove} />
    <div className={styles.img}>
      <img src={props.src} />
    </div>
  </div>
)

const ImgPicker = props => {
  const { imgSrc, addImg, cancelImg } = props
  return (
    <div style={{ display: 'block' }}>
      <div style={{ paddingTop: '0.18rem', marginBottom: '0.3rem' }}>
        <div style={{ marginLeft: '0.16rem', marginRight: '0.16rem' }}>
          <div className={styles.flexbox}>
            <div className={styles.item}>
              { imgSrc === '' ? <ChooseButton addImg={addImg} /> : <ImgDisplay cancelImg={cancelImg} src={imgSrc} />}
            </div>
            <div className={styles.item} />
            <div className={styles.item} />
            <div className={styles.item} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImgPicker
