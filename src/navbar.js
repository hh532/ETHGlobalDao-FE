
import AppBar from '@material-ui/core/AppBar'
import { Grid } from '@material-ui/core'
import Link from 'next/link'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    menuButtons: {
        color: "black",
        fontSize: "15px",
        fontWeight: 700,
        // margin: "0 8px 0px 8px",
        "&:hover": {
            textDecoration: "underline black",
        }
    },
}))

export default function NavBar() {
    const classes = useStyles();

    return (
        <AppBar style={{ background: '#F3C245' }} elevation={0} position="static">
            <Grid container item xs={12}>
                <Grid container item xs={3} justifyContent="center">
                </Grid>

                <Grid container item xs={6} style={{padding: "15px"}}>
                        <Grid container item xs={3} justifyContent="flex-start">
                            <Link href={'/'} passHref>
                                <Button component="a" color="primary" className={classes.menuButtons}>
                                    ETHGlobalDAO
                                </Button>
                            </Link>
                        </Grid>
                        <Grid container item xs={3} justifyContent="flex-end">
                            <Link href={'/nft'} passHref>
                                <Button component="a" color="primary" className={classes.menuButtons}>
                                    Mint
                                </Button>
                            </Link>
                        </Grid>
                        <Grid container item xs={3} justifyContent="flex-end">
                            <Link href={'/dao'} passHref>
                                <Button component="a" color="primary" className={classes.menuButtons}>
                                    DAO
                                </Button>
                            </Link>
                        </Grid>
                        <Grid container item xs={3} justifyContent="flex-end">
                            <Link href={'/proposal'} passHref>
                                <Button component="a" color="primary" className={classes.menuButtons}>
                                Proposals
                                </Button>
                            </Link>
                        </Grid>
                </Grid>

                <Grid container item xs={3} justifyContent="center">
                </Grid>
            </Grid>
        </AppBar>
    )
}
