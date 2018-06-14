import React from 'react';

import { Platform, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { COLORS, FONT_SIZE } from './consts';
import { Constants, Location, Permissions } from 'expo';



const Container = styled.View`
  flex: 1;
`;

const List = styled.SectionList`
  background-color: ${COLORS.YELLOW};
  flex: 1;
`;

const Row = styled.View`
  flex-direction: row;
  padding: 5%;
`;

const Title = styled.Text`
   flex-grow: 2;
   color: ${COLORS.BLUE};
   font-size: ${FONT_SIZE}px;
`;

const Bikes = styled.Text`
  text-align: right;
  color: ${COLORS.BLUE};
  font-size: ${FONT_SIZE}px;
`;
const SectionHeader = styled.Text`
  background-color: ${COLORS.BLUE};
  color: ${COLORS.YELLOW};

  padding: 5%;
  font-size: ${FONT_SIZE}px;
  font-weight: bold;
  color: white;
`;

class ListView extends React.PureComponent {

  static navigationOptions = navigation => ({
    title: 'Stations'
  });

  state = {
    isLoading: false,
    error: undefined,
    locations: [],
    geoLocation: null,
    history: [],
  };

  componentDidMount() {
    this.loadStations();
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        error: 'Permission to access geoLocation was denied',
      });
    }

    let geoLocation = await Location.getCurrentPositionAsync({});
    this.setState({ geoLocation });
  };


  loadStations = async () => {
    this.setState({
      error: null,
      isLoading: true,
    });

    try {
      const data = await fetch('http://fiets.openov.nl/locaties.json');
      const json = await data.json();
      this.setState({
        isLoading: false,
        locations: Object
          .values(json.locaties)
          .filter(location => location.description)
          .sort((a, b) => a.description > b.description ? 1 : -1 ),
      })

    } catch (ex) {
      this.setState({
        error: ex,
        isLoading: true,
      });
    }
  };

  handleTap = location => {
    this.props.navigation.navigate("DetailView", {
      location,
      geoLocation: this.state.geoLocation,
    });

    this.setState({
      history: [...this.state.history, location]
    });
  };

  render() {

    const { isLoading, error, locations, history } = this.state;

    return (
      <Container>
        {isLoading && <Text>Loading...</Text>}
        {error && <Text>{error}</Text>}
        {locations.length > 0 && (
          <List
            sections={[
              { title: "history", data: history },
              { title: "stations", data: locations }
            ]}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={this.handleTap.bind(this, item)}>
                <Row>
                  <Title>
                    {item.description}
                  </Title>
                  <Bikes>
                    {item.extra.rentalBikes}🚲
                  </Bikes>
                </Row>
              </TouchableOpacity>
            )}
            renderSectionHeader={({section}) => (
              <SectionHeader>{section.title}</SectionHeader>
            )}
            keyExtractor={item => item.extra.locationCode}
          />
        )}
      </Container>
    )
  }
}

export default ListView;
