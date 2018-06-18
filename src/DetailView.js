import React from 'react';
import styled from 'styled-components';
import { COLORS } from './consts';
import { MapView } from 'expo';

const Container = styled.View`
  flex: 1;
  background-color: ${COLORS.YELLOW};
`;

const Bikes = styled.Text`
  text-align: center;
  color: ${COLORS.BLUE};
  font-size: 100px;
`;

const BikesIcon = styled.Text`
  text-align: center;
  color: ${COLORS.BLUE};
  font-size: 100px;
  line-height: 96px;
`;

const BikesContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`;

class DetailView extends React.PureComponent {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('location').description,
  });

  render() {
    const location = this.props.navigation.getParam('location');
    const geoLocation = this.props.navigation.getParam('geoLocation');

    return (
      <Container>

        <BikesContainer>
          <Bikes>{location.extra.rentalBikes}</Bikes>
          <BikesIcon>🚲</BikesIcon>
        </BikesContainer>

        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.lat,
            longitude: location.lng,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          <MapView.Marker
            coordinate={{
              latitude: location.lat,
              longitude: location.lng,
            }}
            title={location.description}
          />

          {geoLocation && (
            <MapView.Marker
              coordinate={geoLocation.coords}
              title={"You are here"}
              pinColor={COLORS.BLUE}
            />
          )}

        </MapView>

      </Container>
    )
  }
}

export default DetailView;
