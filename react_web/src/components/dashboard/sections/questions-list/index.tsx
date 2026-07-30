import Wrapper from "@/share/organisms/Wrapper"
import { Button } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

function QuestionsList() {
  const navigate = useNavigate()

  return (
    <Wrapper>
      <Button onClick={() => navigate('/dashboard/questions/edit')} variant="secondary">Add Questions</Button>
      QuestionsList</Wrapper>
  )
}

export default QuestionsList