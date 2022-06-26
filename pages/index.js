import NavBar from '../src/navbar'
import { Grid } from '@material-ui/core'
import styles from '../styles/Home.module.css'

export default function Home() {
	return (
		<div>
			<NavBar/>
            <Grid container item xs={12}>
				<Grid container item xs={3} justifyContent="center">
				</Grid>

				<Grid container item xs={6} justifyContent="center">
					<h1 className={styles.title}>
                        ETHGlobalDAO
					</h1>
				</Grid>

				<Grid container item xs={3} justifyContent="center">
				</Grid>
			</Grid>
		</div>
	)
}
