# Doors UI

Some random windows OS UI experiments on web because dashboard has too many stuffs,
<br/>Many codes are ripped of from chakra-ui slide transition with a lof of modifications, credit and links are inside the correspoding source code. 
```
npm i doors-ui
```
```javascript
    import 'doors-ui/src/globals.css'
    import { Door, useDisclosure } from 'doors-ui';

    const App = () => {
    const disclosureProps = useDisclosure({ defaultIsOpen: true });
        return (
            <div>
                <button onClick={disclosureProps.onToggle}>open A</button>
                <Door title={'A'} disclosureProps={disclosureProps} lessThanScreen={true}>
                    content for A
                </Door>
            </div>
        );
    };
```
![screen](https://user-images.githubusercontent.com/35160613/149459492-0a9a3e55-bc77-4b73-81b0-fb5126cd8d73.gif)
