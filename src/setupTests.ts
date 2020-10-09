import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import '@testing-library/jest-dom';
import 'isomorphic-fetch';
import 'jest-ts-auto-mock';

configure({ adapter: new Adapter() });

// Mocks the Fullscreen API. This is needed for ToggleFullScreenButton.test.tsx.
Object.defineProperty(document, 'fullscreenEnabled', { value: true, writable: true });
