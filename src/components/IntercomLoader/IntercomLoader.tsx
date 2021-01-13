import useIntercom from '~/hooks/useIntercom/useIntercom';

// this component just make sure intercom is loaded for its effects
export default function IntercomLoader() {
  useIntercom();
  return null;
}
