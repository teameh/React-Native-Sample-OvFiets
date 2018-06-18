import React from 'react';

import { Platform, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { API_URL, COLORS } from './consts';
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
  padding: 15px 10px;
`;

const Title = styled.Text`
   flex-grow: 2;
   color: ${COLORS.BLUE};
   font-size: 20px;
`;

const Bikes = styled.Text`
  text-align: right;
  color: ${COLORS.BLUE};
  font-size: 20px;
`;

const SectionHeader = styled.Text`
  background-color: ${COLORS.BLUE};
  color: ${COLORS.YELLOW};
  padding: 5px 10px;
  font-size: 18px;
  color: ${COLORS.WHITE};
`;

class ListView extends React.PureComponent {

  // title for react-navigation
  static navigationOptions = navigation => ({
    title: 'Ov Fiets'
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
        error: 'geolocation will not work in an Android emulator.',
      });
    } else {
      this.getLocationAsync();
    }
  }

  getLocationAsync = async () => {
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
      const data = await fetch(API_URL);
      const json = await data.json();
      this.setState({
        isLoading: false,
        locations: Object
          .values(json.locaties)
          .filter(location => location.description)
          .sort((a, b) => a.description > b.description ? 1 : -1),
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
      history: [
        // filter out the item we will add to avoid duplicates
        ...this.state.history.filter(
          item => item.extra.locationCode !== location.extra.locationCode
        ),
        location
      ]
    });
  };

  render() {

    const { isLoading, error, locations, history } = this.state;

    const sections = [
      { title: "Stations", data: locations }
    ];

    if (history.length > 0) {
      sections.unshift({ title: "History", data: history });
    }

    return (
      <Container>
        {isLoading && <Text>Loading...</Text>}
        {error && <Text>{error}</Text>}
        {locations.length > 0 && (
          <List
            sections={sections}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={this.handleTap.bind(this, item)}>
                <Row>
                  <Title>
                    {item.description}
                  </Title>
                  <Bikes>
                    {item.extra.rentalBikes} 🚲
                  </Bikes>
                </Row>
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section }) => (
              history.length > 0 ? (
                <SectionHeader>{section.title}</SectionHeader>
              ) : null
            )}
            keyExtractor={item => item.extra.locationCode}
          />
        )}
      </Container>
    )
  }
}

export default ListView;
