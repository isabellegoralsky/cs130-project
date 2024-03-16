// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

import Goal from './components/Goal';
import renderer from 'react-test-renderer';

test('df', () => {
  const component = renderer.create(
    <Goal teamid={'mock'} gid={'mock'} title={'mock'} description={'mock'} savedprogress={10}
    goalvalue={100} name={'mock'} type={'PR'} unit={'LBS'} date={"01/01/01"}></Goal>
  );
  let tree = component.toJSON();
})