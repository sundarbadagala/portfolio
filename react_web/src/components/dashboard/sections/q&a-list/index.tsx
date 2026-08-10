import Wrapper from "@/share/organisms/Wrapper"
import { Button } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

function InterviewList() {
    const navigate = useNavigate()
    return (
        <Wrapper>
            <Button onClick={() => navigate('/dashboard/q&a/edit')} variant="secondary">Add Q&A</Button>
        </Wrapper>
    )
}

export default InterviewList