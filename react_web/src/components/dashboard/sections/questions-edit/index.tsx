import { Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react'
import Wrapper from "@/share/organisms/Wrapper"
import { QUESTIONS_TABS } from '@/helper/constants'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import QuestionJson from './questions-json'
import QuestionSheets from './questions-sheets'
import QuestionTable from './questions-table'

function QuestionsEdit() {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const id: number = Number(params.get('tab')) || 0

  const [tabIndex, setTabIndex] = useState<number>(id || 0)

  const handleChange = (index: number) => {
    setTabIndex(tabIndex)
    navigate(`/dashboard/questions/edit?tab=${index}`)
  }
  return (
    <Wrapper>
      <Tabs size='md' variant='enclosed' onChange={handleChange} defaultIndex={tabIndex}>
        <TabList>
          {
            QUESTIONS_TABS.map(tab => <Tab _selected={{ bgColor: 'red' }}>{tab.label}</Tab>)
          }
        </TabList>
        <TabPanels>
          <TabPanel>
            <QuestionJson />
          </TabPanel>
          <TabPanel>
            <QuestionSheets />
          </TabPanel>
          <TabPanel>
            <QuestionTable />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Wrapper>
  )
}

export default QuestionsEdit