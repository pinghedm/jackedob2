import React, { useState } from 'react'
import { useExercises, useExerciseDetails, ExerciseDetail } from 'services/exercise_service'
import { Input, AutoComplete, DatePicker, Typography } from 'antd'
import moment from 'moment'

export interface HistoryProps {}

const getReducedExerciseDetails = (
    exerciseDetails: ExerciseDetail[],
    searchString: string,
    searchDate: string,
) => {
    const reducedExercises = exerciseDetails
        .filter(e => e.name.includes(searchString))
        .map(e => {
            const reducedSets = e.sets.filter(s =>
                moment(s.date).toDate().toISOString().includes(searchDate),
            )
            return { ...e, sets: reducedSets }
        })
        .filter(e => e.sets.length > 0)
    return reducedExercises
}

const History = ({}: HistoryProps) => {
    const { data: exercises } = useExercises()
    const exerciseDetails = useExerciseDetails(exercises?.map(e => e.slugName) ?? [])
    const [exerciseSearch, setExerciseSearch] = useState('')
    const [searchDateString, setSearchDateString] = useState('')
    const datesWithSets = exerciseDetails
        .flatMap(e => e.sets.map(s => s.date))
        .map(d => moment(d).toISOString().split('T')[0])
    return (
        <>
            <Typography.Title level={3}>View History</Typography.Title>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '20px',
                    marginTop: '20px',
                    fontSize: '24px',
                    gap: '20px',
                }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
                    <Typography.Text>Search By Exercise:</Typography.Text>
                    <AutoComplete
                        filterOption={true}
                        value={exerciseSearch}
                        options={exerciseDetails?.map(e => ({ value: e.name }))}
                        onChange={value => {
                            setExerciseSearch(value)
                        }}
                        onSelect={(value: string) => {
                            setExerciseSearch(value)
                        }}>
                        <Input.Search
                            placeholder="Exercise to show"
                            enterButton="Search"
                            onPressEnter={e => {}}
                        />
                    </AutoComplete>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
                    <Typography.Text>Search By Date:</Typography.Text>
                    <DatePicker
                        dateRender={current => {
                            const dateHasSets = datesWithSets.includes(
                                current.toDate().toISOString().split('T')[0],
                            )
                            return (
                                <div
                                    className="ant-picker-cell-inner"
                                    style={{
                                        border: dateHasSets ? '1px solid green' : undefined,
                                        borderRadius: dateHasSets ? '50%' : undefined,
                                        backgroundColor: dateHasSets ? 'lightgreen' : undefined,
                                    }}>
                                    {current.date()}
                                </div>
                            )
                        }}
                        onChange={(date, dateString) => {
                            setSearchDateString(
                                date?.toDate()?.toISOString()?.split('T')?.[0] ?? '',
                            )
                        }}
                    />
                </div>
            </div>
            {getReducedExerciseDetails(exerciseDetails, exerciseSearch, searchDateString).map(
                (e, i) => (
                    <div key={i}>{JSON.stringify(e)}</div>
                ),
            )}
        </>
    )
}

export default History
