import React from 'react'
import { DentalProvider } from './context/DentalContext'
import SideNav from './components/SideNav'
import OdontogramChart from './components/OdontogramChart'
import ConditionSidebar from './components/ConditionSidebar'
import SingleToothEditor from './components/SingleToothEditor'
import SummaryModal from './components/SummaryModal'
import SvgPatternDefs from './components/SvgPatternDefs'

export default function App() {
  return (
    <DentalProvider>
      <SvgPatternDefs />
      <SideNav />
      <div className="main-content" id="appContainer">
        <OdontogramChart />
        <SingleToothEditor />
        <ConditionSidebar />
      </div>
      <SummaryModal />
    </DentalProvider>
  )
}
