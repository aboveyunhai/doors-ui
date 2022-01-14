import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as renderer from 'react-test-renderer';
import { Door, useDisclosure } from '../src/index';

describe('door', () => {
  const DoorTest = () => {
    const disclosureProps = useDisclosure();
    return (
      <Door title={'test'} disclosureProps={disclosureProps}>
        test
      </Door>
    );
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<DoorTest />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('is close', () => {
    const component = renderer.create(<DoorTest />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
