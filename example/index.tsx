import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Door, useDisclosure } from '../src';
import '../src/globals.css';
import { LoremIpsum } from "lorem-ipsum";

const App = () => {
  const disclosureProps = useDisclosure({ defaultIsOpen: true });
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
    <div>
      <button onClick={disclosureProps.onToggle}>open A</button>
      <Door title={'A'} disclosureProps={disclosureProps} lessThanScreen={true}>
        {lorem.generateParagraphs(7)}
      </Door>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
