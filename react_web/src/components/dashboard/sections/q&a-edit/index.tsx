"use client";
import { useEffect, useState } from "react";
import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { useCustomToast } from "@/hooks";
import { MultiSelect } from "chakra-multiselect";
import CustomEditor from "@/share/organisms/Editor";
import Wrapper from "@/share/organisms/Wrapper";
import { useBottomSheet } from "@/utils/context/BottomSheet";
import { useNavigate, useSearchParams } from "react-router-dom";
import { QandAService } from "../../service";

function PreviewInterviewContent({ question, answer, category, subCategory }: { question: string, answer: string, category: any[], subCategory: any[] }) {
  return (
    <VStack gap={"16px"} justifyContent={"flex-start"} alignItems={"flex-start"} align="stretch" p={4} data-lenis-prevent>
      <Box>
        <Text fontSize={"lg"} fontWeight={"bold"} color="teal.300" mb={2}>
          Question:
        </Text>
        <Box
          sx={{
            "h1, h2, h3, h4, h5, h6, ul, ol, li, p, blockquote, code": {
              all: "revert",
            },
            "pre": {
              width: "100%",
              overflowX: "auto"
            }
          }}
          dangerouslySetInnerHTML={{ __html: question }}
        />
      </Box>
      <Box style={{ margin: "16px 0" }}>
        <hr />
      </Box>
      <Box>
        <Text fontSize={"lg"} fontWeight={"bold"} color="teal.300" mb={2}>
          Answer:
        </Text>
        <Box
          sx={{
            "h1, h2, h3, h4, h5, h6, ul, ol, li, p, blockquote, code": {
              all: "revert",
            },
            "pre": {
              width: "100%",
              overflowX: "auto"
            }
          }}
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      </Box>
      <Box style={{ margin: "16px 0" }}>
        <hr />
      </Box>
      <HStack gap={2}>
        <Text fontWeight="semibold" fontSize="sm">Category:</Text>
        {category.map((c: any) => (
          <Box key={c.value} bg="neutral.700" px={2.5} py={1} borderRadius="md" fontSize="xs">
            {c.label}
          </Box>
        ))}
      </HStack>
      <HStack gap={2} mt={2}>
        <Text fontWeight="semibold" fontSize="sm">Subcategory:</Text>
        {subCategory.map((s: any) => (
          <Box key={s.value} bg="neutral.800" px={2.5} py={1} borderRadius="md" fontSize="xs">
            {s.label}
          </Box>
        ))}
      </HStack>
    </VStack>
  );
}

function InterviewEdit() {
  const toast = useCustomToast();
  const [params] = useSearchParams();
  const qanda_id = params.get("qanda_id");
  const navigate = useNavigate();
  const { handleOpen } = useBottomSheet();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState<any>([]);
  const [subCategory, setSubCategory] = useState<any>([]);

  const [allCategories] = useState<{ label: string; value: string }[]>([
    { label: "Frontend", value: "Frontend" },
    { label: "Backend", value: "Backend" },
    { label: "DevOps", value: "DevOps" },
    { label: "System Design", value: "System Design" },
    { label: "Database", value: "Database" },
  ]);

  const [allSubCategories] = useState<{ label: string; value: string }[]>([
    { label: "React", value: "React" },
    { label: "Vue", value: "Vue" },
    { label: "Angular", value: "Angular" },
    { label: "Node.js", value: "Node.js" },
    { label: "Python", value: "Python" },
    { label: "Go", value: "Go" },
    { label: "Docker", value: "Docker" },
    { label: "Kubernetes", value: "Kubernetes" },
    { label: "AWS", value: "AWS" },
    { label: "MySQL", value: "MySQL" },
    { label: "MongoDB", value: "MongoDB" },
    { label: "PostgreSQL", value: "PostgreSQL" },
    { label: "Redis", value: "Redis" },
  ]);

  useEffect(() => {
    (async () => {
      if (qanda_id) {
        const res = await QandAService.getQandAApi(qanda_id);
        if (res.status === 200 && res.data?.data) {
          const { question: fetchedQuestion, answer: fetchedAnswer, category: fetchedCategory, subCategory: fetchedSubCategory } = res.data.data;
          setQuestion(fetchedQuestion || "");
          setAnswer(fetchedAnswer || "");
          setCategory(fetchedCategory || []);
          setSubCategory(fetchedSubCategory || []);
        }
      }
    })();
  }, [qanda_id]);

  const handleQuestionChange = (data: string) => {
    setQuestion(data);
  };

  const handleAnswerChange = (data: string) => {
    setAnswer(data);
  };

  const handlePreview = () => {
    if (question && answer && category.length > 0 && subCategory.length > 0) {
      handleOpen(
        <PreviewInterviewContent
          question={question}
          answer={answer}
          category={category}
          subCategory={subCategory}
        />
      );
    } else {
      toast.error("Please fill in all fields (Question, Answer, Category, Subcategory)");
    }
  };

  const handleSubmit = async () => {
    console.log('category', category)
    console.log('subCategory', subCategory)
    console.log('question', question)
    console.log('answer', answer)

    if (!question || !answer || category.length === 0 || subCategory.length === 0) {
      toast.error("Check all fields are filled");
      return;
    }

    try {
      const payload = {
        question,
        answer,
        category,
        sub_category: subCategory,
      };

      let res;
      if (qanda_id) {
        res = await QandAService.updateQandAAPi(qanda_id, payload);
      } else {
        res = await QandAService.postQandAAPi(payload);
      }

      if (res.status === 200) {
        toast.success("Q&A data submitted successfully");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Wrapper>
      <Flex direction={"column"} gap={4} m={"24px 0"}>
        <Box>
          <label style={{ fontWeight: "600", fontSize: "14px" }}>Question</label>
          <CustomEditor onData={handleQuestionChange} initialValue={question} />
        </Box>
        <Box>
          <label style={{ fontWeight: "600", fontSize: "14px" }}>Answer</label>
          <CustomEditor onData={handleAnswerChange} initialValue={answer} />
        </Box>

        <Box>
          <MultiSelect
            options={allCategories}
            value={category}
            label="Category"
            onChange={(res: any) => setCategory(res)}
            create
            labelProps={{ fontWeight: "medium", fontSize: "sm", mb: 1 }}
            controlProps={{ border: "1px solid" }}
            listProps={{ borderRadius: "md", boxShadow: "md", zIndex: 10, "data-lenis-prevent": "true" } as any}
            selectedListProps={{ gap: 1 }}
            single
          />
        </Box>
        <Box>
          <MultiSelect
            options={allSubCategories}
            value={subCategory}
            label="Subcategory"
            onChange={(res: any) => setSubCategory(res)}
            create
            labelProps={{ fontWeight: "medium", fontSize: "sm", mb: 1 }}
            controlProps={{ border: "1px solid" }}
            listProps={{ borderRadius: "md", boxShadow: "md", zIndex: 10, "data-lenis-prevent": "true" } as any}
            selectedListProps={{ gap: 1 }}
            single
          />
        </Box>
      </Flex>
      <HStack gap={3}>
        <Button variant={"primary"} onClick={handlePreview}>
          VIEW
        </Button>
        <Button variant={"secondary"} onClick={handleSubmit}>
          SUBMIT
        </Button>
        <Button variant={"error"} onClick={handleLogout}>
          Logout
        </Button>
      </HStack>
    </Wrapper>
  );
}

export default InterviewEdit;