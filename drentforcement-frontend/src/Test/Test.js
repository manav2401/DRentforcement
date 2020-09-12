import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const cards2 = [
    {"index": 1, "link": "https://images.unsplash.com/photo-1477862096227-3a1bb3b08330?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"},
    {"index": 2, "link": "https://images.unsplash.com/photo-1477862096227-3a1bb3b08330?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"},
    {"index": 3, "link": "https://images.unsplash.com/photo-1477862096227-3a1bb3b08330?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"},
    {"index": 4, "link": "https://images.unsplash.com/photo-1477862096227-3a1bb3b08330?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"},
    {"index": 5, "link": "https://images.unsplash.com/photo-1477862096227-3a1bb3b08330?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"},
    {"index": 6, "link": "https://images.unsplash.com/photo-1477862096227-3a1bb3b08330?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"},
]

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    buttons: {
        alignItems: 'center',
    }
}));

class Test extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        const TopBar = (
            <AppBar position="relative">
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                        D-Rentforcement
                    </Typography>
                </Toolbar>
            </AppBar>
        )

        const Body = (
            <Container maxWidth="sm">
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    D-Rentforcement
                </Typography>
                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                    A Decentralized C2C Renting Platform!
                </Typography>

                {/* buttons to be added here */}
                {/* <div className={classes.heroButtons}> */}
                {/* <Grid container spacing={2} justify="center"> */}
                {/* <Grid item> */}
                {/* <Button variant="contained" color="primary"> */}
                {/* Main call to action */}
                {/* </Button> */}
                {/* </Grid> */}
                {/* <Grid item> */}
                {/* <Button variant="outlined" color="primary"> */}
                {/* Secondary action */}
                {/* </Button> */}
                {/* </Grid> */}
                {/* </Grid> */}
                {/* </div> */}

            </Container>
        )

        const Footer = (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://material-ui.com/">
                    Your Website
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        )

        return (
            <React.Fragment>
                <CssBaseline />
                {TopBar}
                <main>
                    <div className={useStyles.heroContent}>
                        {Body}
                    </div>
                    <Container className={useStyles.cardGrid} maxWidth="md">
                    <Grid container spacing={4}>
                    {cards2.map((card) => (
                        <Grid item key={card.index} xs={12} sm={6} md={4}>
                            <Card className={useStyles.card}>
                                <CardMedia
                                    className={useStyles.cardMedia}
                                    image={card.link}
                                    title="Image title"
                                />
                                <CardContent className={useStyles.cardContent}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Product
                                    </Typography>
                                    <Typography>
                                        Product Description
                                    </Typography>
                                </CardContent>
                                
                                <CardActions>
                                    <Button size="small" color="primary">
                                        Borrow
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}

                    </Grid>
                    </Container>
                </main>

                <footer className={useStyles.footer}>
                    {Footer}
                </footer>
            </React.Fragment>
        )

    }

}

export default Test;