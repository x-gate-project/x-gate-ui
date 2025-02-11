import { AppInitialProps } from 'next/app';

interface Props extends AppInitialProps {}

const About = (props: Props) => {
  return (
    <>
      <h1>About</h1>
      <p>Version : {process.env.VERSION}</p>
    </>
  );
};

export default About;
