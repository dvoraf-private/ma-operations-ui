import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import styles from "./PromotionHP.module.scss"


// import './loading.css';

export const Loading = () => (
    <div className={styles.loadingShadingMui}>
        <CircularProgress className={styles.loadingIconMui} />
    </div>
);
