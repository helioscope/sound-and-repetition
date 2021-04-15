import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import './App.css';
import {Button, Container} from '@material-ui/core';
import { ThemeProvider, createMuiTheme, Theme } from '@material-ui/core/styles';
import { cyan, teal } from '@material-ui/core/colors';
import { ToggleButton } from '@material-ui/lab';

const theme : Theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: cyan,
    secondary: teal,
    background: {
      default: '#202032'
    }
  },
});

type AppState = {
  selected: boolean
};

class App extends React.Component {
  state : AppState = {
    selected : false
  }
  render() {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <Container>
            <div>Container</div>
            <div>
              <Button variant="contained">Default contained</Button>
              <Button variant="outlined">Default outlined</Button>
              <Button>Default default</Button>
            </div>
            <div>
              <Button color="primary" variant="contained">Primary contained</Button>
              <Button color="primary" variant="outlined">Primary outlined</Button>
              <Button color="primary">Primary default</Button>
            </div>
            <div>
              <Button color="secondary" variant="contained">Secondary contained</Button>
              <Button color="secondary" variant="outlined">Secondary outlined</Button>
              <Button color="secondary">Secondary default</Button>
            </div>
            <div>
              {/* Note: ToggleButton doesn't support a "color" prop. */}
              <ToggleButton value="check"
                  selected={this.state.selected}
                  onChange={() => {
                    this.setState({selected : !this.state.selected});
                  }}>
                Toggle
              </ToggleButton>
            </div>
          </Container>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
