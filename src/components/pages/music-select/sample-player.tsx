import * as React from 'react';

interface SamplePlayerProps {
  sampleMusicPlay: () => void;
  sampleMusicFadeOut: () => void;
}

interface SamplePlayerState {}

export class SamplePlayer extends React.Component<
  SamplePlayerProps,
  SamplePlayerState
> {
  componentDidMount() {
    this.props.sampleMusicPlay();
  }
  componentWillUnmount() {
    this.props.sampleMusicFadeOut();
  }

  render() {
    return <div />;
  }
}
