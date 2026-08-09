import { Box } from "@chakra-ui/react";
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";


export const V3 = (
  <h6>
    4 years and 10 months specializing in edtech platforms, building scalable React.js and Next.js applications used by 500K+ concurrent users. Experience in designing feature-based modular architecture, enabling scalable, maintainable, and efficient frontend systems. Strong focus on reusable components, performance optimization, and delivering responsive, user-centric interfaces in fast-paced environments.
  </h6>
);

export const V2 = (
  <h6>
    <RoughNotationGroup show>
      <RoughNotation type="underline"> Software engineer </RoughNotation> with{" "}
      <RoughNotation type="highlight" color="#0958d7">
        {" "}
        4 years and 9 months{" "}
      </RoughNotation>{" "}
      specializing in edtech platforms, building scalable{" "}
      <RoughNotation type="circle" color="yellow">
        {" "}
        React.js and Next.js{" "}
      </RoughNotation>
      applications used by 500K+ concurrent users. Experienced in designing
      <Box fontWeight={'bold'} as='span' color={'#00910e'}>
        {" "}
        feature-based modular architecture
      </Box>
      , enabling scalable, maintainable, and efficient frontend systems. Strong
      focus on reusable components, performance optimization, and delivering
      responsive, user-centric interfaces in fast-paced environments.
    </RoughNotationGroup>
  </h6>
);

export const V1 = (
  <h6>
    <RoughNotationGroup show>
      <RoughNotation type="underline"> Frontend Developer </RoughNotation>
      with{" "}
      <RoughNotation type="highlight" color="#9cbff7">
        {" "}
        4.5+ years{" "}
      </RoughNotation>{" "}
      of experience building scalable and high-performance web applications
      using{" "}
      <RoughNotation type="circle" color="red">
        React.js, Next Js
      </RoughNotation>{" "}
      and modern UI frameworks. Experienced in designing feature-based modular
      monolithic architecture, enabling scalable, maintainable, and efficient
      frontend systems. Strong focus on reusable components, performance
      optimization, and delivering responsive, user-centric interfaces in
      fast-paced environments.
    </RoughNotationGroup>
  </h6>
);
