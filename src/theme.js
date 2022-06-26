import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#212121',
        },
        secondary: {
            main: '#ffffff',
            // #19857b
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#fff',
        },
    },
    // overrides: {
    //     MuiCheckbox: {
    //       colorDefault: {
    //         color: "#000000",
    //         '&$checked': {
    //           color: "#000000",
    //         },
    //       },
    //     },
    //   },
});

export default theme;