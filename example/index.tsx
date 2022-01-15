import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Door, useDisclosure } from '../src';
import '../src/globals.css';
import { LoremIpsum } from "lorem-ipsum";

const App = () => {
  const disclosurePropsOn = useDisclosure({ defaultIsOpen: true });
  const disclosurePropsOff = useDisclosure({ defaultIsOpen: false });
  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4
    },
    wordsPerSentence: {
      max: 16,
      min: 4
    }
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <button onClick={disclosurePropsOn.onToggle}>default on</button>
      <Door
        title={'A'}
        disclosureProps={disclosurePropsOn}
        lessThanScreen={true}
      >
        default is open
      </Door>
      <button onClick={disclosurePropsOff.onToggle}>default off</button>
      <Door
        title={'A'}
        disclosureProps={disclosurePropsOff}
        lessThanScreen={true}
      >
        {lorem.generateParagraphs(7)}
      </Door>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
