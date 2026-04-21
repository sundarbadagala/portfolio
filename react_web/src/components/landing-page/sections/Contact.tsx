import { useMemo, useState } from "react";
import {
  Button,
  Text,
  Image,
  Box,
  Flex,
  Grid,
  useColorModeValue
} from "@chakra-ui/react";
import Wrapper from "@/share/organisms/Wrapper";
import InputField from "@/share/molecule/InputField";
import { QUERY_FIELDS, MEDIA_CONNECTS } from "@/helper/constants";
import { IStateQuery, IStateError, IQueryField } from "../index.interface";
import { IChangeEvent, ISubmitEvent } from "@/helper/interface";
import { emailValidation } from "@/helper/validations";
import { ContactLink } from "@/share/atoms/links";
import { motion } from "framer-motion";
import { useCustomToast } from "@/hooks";
import { apiHandler } from "@/utils/apiHandler/service";
import * as endpionts from "@/helper/endpoints";
import { throttling } from "@/helper/methods";

export default function ContactSection() {
  const customToast = useCustomToast();
  const [query, setQuery] = useState<IStateQuery>({
    sender: "",
    email: "",
    message: ""
  });

  const [error, setError] = useState<IStateError>({
    sender: "",
    email: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const bgToken = "bg";
  const outerShadow = useColorModeValue(
    "8px 8px 16px #c9c7c8, -8px -8px 16px #ffffff",
    "8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.08)"
  );

  const innerShadow = useColorModeValue(
    "inset 6px 6px 12px #c9c7c8, inset -6px -6px 12px #ffffff",
    "inset 6px 6px 12px rgba(0, 0, 0, 0.5), inset -6px -6px 12px rgba(255, 255, 255, 0.08)"
  );

  const isButtonDisabled = useMemo(() => {
    const isNoError = Object.values(error).every((item) => item === "");
    const isAllQuery = Object.values(query).every((item) => item !== "");
    return isNoError && isAllQuery;
  }, [error, query]);

  const handlError = (name: string, value: string) => {
    if (name === "email" && !emailValidation.test(value)) {
      setError((prevError) => ({
        ...prevError,
        [name]: "Enter a valid email"
      }));
    }
    if (name === "email" && emailValidation.test(value)) {
      setError((prevError) => ({
        ...prevError,
        [name]: ""
      }));
    }
  };

  const handleChange = (e: IChangeEvent): void => {
    const { value, name } = e.target;
    handlError(name, value);
    setQuery((prevQuery) => ({
      ...prevQuery,
      [name]: value
    }));
  };

  const handleSubmit = throttling(async (e: ISubmitEvent): Promise<void> => {
    try {
      e.preventDefault();
      if (!isButtonDisabled || isSubmitting) return;

      setIsSubmitting(true);
      const { email, message, sender } = query;
      const reqBody = {
        sender,
        mail: email,
        query: message
      };

      const res = await apiHandler.post(endpionts.POST_QUERY, {
        payload: reqBody
      });

      if (res.status === 200 && res.data?.status === "success") {
        setQuery({
          sender: "",
          email: "",
          message: ""
        });
        customToast.success("Query sent successfully!");
        return;
      }

      // Handle different error scenarios
      if (res.status === 400) {
        customToast.error("Please check your input and try again.");
      } else if (res.status === 429) {
        customToast.error("Too many requests. Please wait a moment.");
      } else if (res.status >= 500) {
        customToast.error("Server error. Please try again later.");
      } else {
        customToast.error("Failed to send message. Please try again.");
      }

    } catch (error: any) {
      console.error("Contact form submission error:", error);

      // Handle network errors or other exceptions
      if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
        customToast.error("Network error. Please check your connection.");
      } else {
        customToast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, 2000);

  return (
    <Wrapper>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Text variant={"H1"} mb={8}>
          CONTACT
        </Text>
      </motion.div>
      <div className="row">
        <motion.div
          className="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-6"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box
            bg={bgToken}
            p={{ base: 6, md: 8 }}
            borderRadius="2xl"
            boxShadow={outerShadow}
          >
            <form onSubmit={ handleSubmit}>
              {QUERY_FIELDS.map((field: IQueryField) => (
                <InputField
                  key={field.id}
                  type={field.type}
                  label={field.label}
                  id={field.id}
                  placeholder={field.placeholder}
                  value={query[field.id as keyof IStateQuery]}
                  onChange={handleChange as any}
                  error={error[field.id as keyof IStateQuery]}
                />
              ))}
              <motion.div
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                style={{ marginTop: "32px" }}
              >
                <Button
                  bg={bgToken}
                  color={useColorModeValue("blue.600", "blue.300")}
                  boxShadow={isButtonDisabled && !isSubmitting ? outerShadow : {}}
                  _active={{ boxShadow: innerShadow }}
                  _hover={{ textDecoration: "none" }}
                  size={"blockMd"}
                  type="submit"
                  w="100%"
                  py={6}
                  borderRadius="xl"
                  isLoading={isSubmitting}
                  loadingText="Sending..."
                  isDisabled={!isButtonDisabled || isSubmitting}
                >
                  Send Me
                </Button>
              </motion.div>
            </form>
          </Box>
        </motion.div>
        <Box
          className="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-6"
          p={{ base: "24px 0", md: "0 40px" }}
          display="flex"
          alignItems="center"
          mb={{ base: 8, md: 0 }}
        >
          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)" }}
            gap={6}
            w="100%"
          >
            {MEDIA_CONNECTS.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 0.95 }}
              >
                <Flex
                  direction="column"
                  align={"center"}
                  justify="center"
                  gap={"16px"}
                  p={6}
                  borderRadius="2xl"
                  bg={bgToken}
                  boxShadow={outerShadow}
                  transition="all 0.3s"
                  _hover={{ boxShadow: innerShadow }}
                  h="100%"
                >
                  <motion.div whileHover={{ scale: 0.95, rotate: 25 }}>
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={"50px"}
                      cursor={"pointer"}
                    />
                  </motion.div>
                  <ContactLink href={item.link} target={item.link.startsWith('mailto:') ? undefined : "_blank"}>
                    {item.name}
                  </ContactLink>
                </Flex>
              </motion.div>
            ))}
          </Grid>
        </Box>
      </div>
    </Wrapper>
  );
}
