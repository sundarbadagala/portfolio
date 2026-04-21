import { Box, Button, Image, useColorModeValue } from "@chakra-ui/react";
import { Typewriter } from "react-simple-typewriter";
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";
import { TYPE_WRITER } from "@/helper/constants";
import { PROFILE_DARK } from "@/helper/assets";
import Wrapper from "@/share/organisms/Wrapper";
import { useCustomToast, useOnline } from "@/hooks";
import { motion } from "framer-motion";

function HeroSection() {
  const customToast = useCustomToast()
  const bgToken = "bg";
  const outerShadow = useColorModeValue(
    "8px 8px 16px #c9c7c8, -8px -8px 16px #ffffff",
    "8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.08)"
  );
  const innerShadow = useColorModeValue(
    "inset 6px 6px 12px #c9c7c8, inset -6px -6px 12px #ffffff",
    "inset 6px 6px 12px rgba(0, 0, 0, 0.5), inset -6px -6px 12px rgba(255, 255, 255, 0.08)"
  );

  // const handleScroll = () => {
  //   window.scrollTo({
  //     top: 500,
  //     behavior: "smooth",
  //   });
  // };
  const handleDownlaod = useOnline(() => {
    const link = document.createElement("a");
    link.href = "/files/resume.pdf";
    link.download = "sundara_rao_resume.pdf";
    link.click();
    customToast.success('Downloaded successfully.')
  });
  return (
    <Wrapper>
      <div className="row">
        <Box
          as={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" } as any}
          className="col-xs-12 col-sm-12 col-md-12 col-lg-7 col-xl-7 col-7 flex direction-col align-baseline"
          gap={"32px"}
        >
          <div>
            <h1 style={{ fontWeight: "bold", padding: "12px 0" }}>
              Hello World! I'm{" "}
              <Box
                as="span"
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
              >
                <Typewriter words={TYPE_WRITER} cursor cursorStyle="|" loop />
              </Box>
            </h1>
            <h6>
              <RoughNotationGroup show>
                <RoughNotation type="underline">
                  {" "}
                  Frontend Developer{" "}
                </RoughNotation>
                with{" "}
                <RoughNotation type="highlight" color="#9cbff7">
                  {" "}
                  4.5+ years{" "}
                </RoughNotation>{" "}
                of experience building scalable and high-performance web
                applications using{" "}
                <RoughNotation type="circle" color="red">
                  React.js, Next Js
                </RoughNotation>{" "}
                and modern UI frameworks. Experienced in designing feature-based
                modular monolithic architecture, enabling scalable,
                maintainable, and efficient frontend systems. Strong focus on{" "}
                reusable components, performance optimization, and delivering
                responsive, user-centric interfaces in fast-paced environments.
              </RoughNotationGroup>
            </h6>
          </div>
          <motion.div whileHover={{ scale: 0.95 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={handleDownlaod}
              bg={bgToken}
              color={useColorModeValue("blue.600", "blue.300")}
              boxShadow={outerShadow}
              borderRadius="xl"
              px={8}
              py={6}
              _hover={{ textDecoration: "none" }}
              _active={{ boxShadow: innerShadow }}
            >
              Download Resume
            </Button>
          </motion.div>
        </Box>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 col-5 ">
          <motion.div
            className="flex justify-center align-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src={PROFILE_DARK}
              alt="profile"
              borderRadius={"50%"}
              height={"400px"}
              boxShadow="2xl"
            />
          </motion.div>
        </div>
      </div>
    </Wrapper>
  );
}

export default HeroSection;

// Frontend Developer with 4.5+ years of experience building scalable and high-performance web applications
// using React.js, Next Js and modern UI frameworks. Experienced in designing feature-based modular
// monolithic architecture, enabling scalable, maintainable, and efficient frontend systems. Strong focus on
// reusable components, performance optimization, and delivering responsive, user-centric interfaces in
// fast-paced environments.
