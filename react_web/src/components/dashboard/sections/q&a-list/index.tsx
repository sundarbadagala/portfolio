"use client";
import { useEffect, useState } from "react";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Flex,
    Button,
    Heading,
    Text,
    Spinner,
    Select,
    Badge,
    Box
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useCustomToast } from "@/hooks";
import { QandAService } from "../../service";
import Wrapper from "@/share/organisms/Wrapper";
import { ICONS } from "@/helper/icons";

interface QandARecord {
    question_id: string;
    question: string;
    answer: string;
    category: string;
    sub_category: string;
    level: string;
    date: string;
    createdAt?: string;
}

function stripHtml(html: string) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

function InterviewList() {
    const navigate = useNavigate();
    const toast = useCustomToast();
    const [data, setData] = useState<QandARecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Sorting States
    const [categorySort, setCategorySort] = useState<string>("none");
    const [subCategorySort, setSubCategorySort] = useState<string>("none");
    const [levelSort, setLevelSort] = useState<string>("none");

    const loadData = async () => {
        setIsLoading(true);
        try {
            const res = await QandAService.getQandAsApi();
            if (res.status === 200 && res.data?.data) {
                setData(res.data.data);
            } else {
                toast.error("Failed to load Q&A list");
            }
        } catch (err) {
            toast.error((err as Error).message || "An error occurred while loading Q&As");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleEdit = (qanda: QandARecord) => {
        navigate(`/dashboard/q&a/edit?qanda_id=${qanda.question_id}`);
    };

    const handleDelete = async (qanda: QandARecord) => {
        const id = qanda.question_id;
        if (window.confirm("Are you sure you want to delete this Q&A?")) {
            try {
                const res = await QandAService.deleteQandAApi(id);
                if (res.status === 200) {
                    toast.success("Q&A deleted successfully");
                    loadData();
                } else {
                    toast.error(res.data?.message || "Failed to delete Q&A");
                }
            } catch (err) {
                toast.error((err as Error).message || "An error occurred while deleting Q&A");
            }
        }
    };

    const handleResetSorts = () => {
        setCategorySort("none");
        setSubCategorySort("none");
        setLevelSort("none");
    };

    // Multi-sorting Logic
    const getSortedData = () => {
        const sorted = [...data];

        sorted.sort((a, b) => {
            // 1. Sort by Level if levelSort is active (beginner, medium, high)
            if (levelSort !== "none") {
                let order = ["beginner", "medium", "high"];
                if (levelSort === "beginner") {
                    order = ["beginner", "medium", "high"];
                } else if (levelSort === "medium") {
                    order = ["medium", "beginner", "high"];
                } else if (levelSort === "high") {
                    order = ["high", "medium", "beginner"];
                }

                const aIdx = order.indexOf((a.level || "").toLowerCase());
                const bIdx = order.indexOf((b.level || "").toLowerCase());

                const aVal = aIdx === -1 ? 99 : aIdx;
                const bVal = bIdx === -1 ? 99 : bIdx;

                if (aVal !== bVal) {
                    return aVal - bVal;
                }
            }

            // 2. Sort by Category if categorySort is active (latest, ascending, descending)
            if (categorySort !== "none") {
                if (categorySort === "ascending") {
                    const comp = (a.category || "").localeCompare(b.category || "");
                    if (comp !== 0) return comp;
                } else if (categorySort === "descending") {
                    const comp = (b.category || "").localeCompare(a.category || "");
                    if (comp !== 0) return comp;
                } else if (categorySort === "latest") {
                    const comp = new Date(b.date || b.createdAt || 0).getTime() - new Date(a.date || a.createdAt || 0).getTime();
                    if (comp !== 0) return comp;
                }
            }

            // 3. Sort by Subcategory if subCategorySort is active (latest, ascending, descending)
            if (subCategorySort !== "none") {
                if (subCategorySort === "ascending") {
                    const comp = (a.sub_category || "").localeCompare(b.sub_category || "");
                    if (comp !== 0) return comp;
                } else if (subCategorySort === "descending") {
                    const comp = (b.sub_category || "").localeCompare(a.sub_category || "");
                    if (comp !== 0) return comp;
                } else if (subCategorySort === "latest") {
                    const comp = new Date(b.date || b.createdAt || 0).getTime() - new Date(a.date || a.createdAt || 0).getTime();
                    if (comp !== 0) return comp;
                }
            }

            // Default sorting: Latest first
            return new Date(b.date || b.createdAt || 0).getTime() - new Date(a.date || a.createdAt || 0).getTime();
        });

        return sorted;
    };

    const sortedData = getSortedData();

    const getLevelBadgeColor = (levelStr: string) => {
        switch ((levelStr || "").toLowerCase()) {
            case "beginner":
                return "green";
            case "medium":
                return "orange";
            case "high":
                return "red";
            default:
                return "gray";
        }
    };

    return (
        <Wrapper>
            <Flex direction={"column"} gap={4} m={"24px 0"}>
                <Flex justifyContent={"space-between"} alignItems="center">
                    <Heading size="lg">Q&A List</Heading>
                    <Button onClick={() => navigate('/dashboard/q&a/edit')} variant="secondary">
                        Add Q&A
                    </Button>
                </Flex>

                {/* Sorting Controller Toolbar */}
                <Flex
                    direction={["column", "row"]}
                    gap={3}
                    p={4}
                    bg="mono.800"
                    borderRadius="md"
                    alignItems={["stretch", "center"]}
                    flexWrap="wrap"
                >
                    <Box flex={1} minW="180px">
                        <Text fontSize="xs" fontWeight="semibold" mb={1} color="mono.300">
                            Category Sort
                        </Text>
                        <Select
                            size="sm"
                            value={categorySort}
                            onChange={(e) => setCategorySort(e.target.value)}
                            bg="mono.900"
                            borderColor="mono.700"
                        >
                            <option value="none">None</option>
                            <option value="latest">Latest</option>
                            <option value="ascending">Ascending (A-Z)</option>
                            <option value="descending">Descending (Z-A)</option>
                        </Select>
                    </Box>

                    <Box flex={1} minW="180px">
                        <Text fontSize="xs" fontWeight="semibold" mb={1} color="mono.300">
                            Subcategory Sort
                        </Text>
                        <Select
                            size="sm"
                            value={subCategorySort}
                            onChange={(e) => setSubCategorySort(e.target.value)}
                            bg="mono.900"
                            borderColor="mono.700"
                        >
                            <option value="none">None</option>
                            <option value="latest">Latest</option>
                            <option value="ascending">Ascending (A-Z)</option>
                            <option value="descending">Descending (Z-A)</option>
                        </Select>
                    </Box>

                    <Box flex={1} minW="180px">
                        <Text fontSize="xs" fontWeight="semibold" mb={1} color="mono.300">
                            Level Sort
                        </Text>
                        <Select
                            size="sm"
                            value={levelSort}
                            onChange={(e) => setLevelSort(e.target.value)}
                            bg="mono.900"
                            borderColor="mono.700"
                        >
                            <option value="none">None</option>
                            <option value="beginner">Beginner First</option>
                            <option value="medium">Medium First</option>
                            <option value="high">High First</option>
                        </Select>
                    </Box>

                    <Button
                        size="sm"
                        colorScheme="teal"
                        onClick={handleResetSorts}
                        alignSelf={["stretch", "flex-end"]}
                        h="32px"
                    >
                        Reset Sorts
                    </Button>
                </Flex>

                {isLoading ? (
                    <Flex justify="center" p={8}>
                        <Spinner size="xl" />
                    </Flex>
                ) : !data || data.length === 0 ? (
                    <Text>No Q&As found.</Text>
                ) : (
                    <TableContainer
                        overflowX="auto"
                        borderRadius="md"
                        border="1px solid"
                        borderColor="mono.700"
                        sx={{
                            scrollBehavior: "smooth",
                            "&::-webkit-scrollbar": {
                                height: "8px",
                            },
                            "&::-webkit-scrollbar-track": {
                                background: "mono.800",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                background: "mono.600",
                                borderRadius: "4px",
                            },
                        }}
                    >
                        <Table variant="simple" size="md">
                            <Thead bg="mono.900">
                                <Tr>
                                    <Th
                                        position="sticky"
                                        left={0}
                                        zIndex={2}
                                        bg="mono.900"
                                        boxShadow="2px 0 2px -1px rgba(255,255,255,0.15)"
                                        color="mono.100"
                                    >
                                        Question ID
                                    </Th>
                                    <Th color="mono.100">Question</Th>
                                    <Th color="mono.100">Category</Th>
                                    <Th color="mono.100">Subcategory</Th>
                                    <Th color="mono.100" textAlign="center">Level</Th>
                                    <Th color="mono.100" textAlign="center">
                                        Actions
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {sortedData.map((qanda: QandARecord) => (
                                    <Tr key={qanda.question_id} role="group" _hover={{ bg: "mono.700" }}>
                                        <Td
                                            position="sticky"
                                            left={0}
                                            zIndex={1}
                                            _groupHover={{ bg: "mono.700" }}
                                            boxShadow="2px 0 2px -1px rgba(255,255,255,0.15)"
                                            fontWeight="bold"
                                        >
                                            {qanda.question_id}
                                        </Td>
                                        <Td maxW="250px" isTruncated>
                                            {stripHtml(qanda.question)}
                                        </Td>
                                        <Td>{qanda.category}</Td>
                                        <Td>{qanda.sub_category}</Td>
                                        <Td textAlign="center">
                                            <Badge colorScheme={getLevelBadgeColor(qanda.level)}>
                                                {qanda.level}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <Flex gap={2} justify="center">
                                                <Button
                                                    size="md"
                                                    variant="secondary"
                                                    onClick={() => handleEdit(qanda)}
                                                >
                                                    <ICONS.Edit size={'20px'} />
                                                </Button>
                                                <Button
                                                    size="md"
                                                    variant="error"
                                                    onClick={() => handleDelete(qanda)}
                                                >
                                                    <ICONS.Delete size={'20px'} />
                                                </Button>
                                            </Flex>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                )}
            </Flex>
        </Wrapper>
    );
}

export default InterviewList;