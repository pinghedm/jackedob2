import React, { useState } from 'react'
import { useExercises, useExerciseDetails, ExerciseDetail } from 'services/exercise_service'
import { Input, AutoComplete, DatePicker, Typography, Card, Row, Col } from 'antd'
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
                moment(s.date).toDate().toLocaleDateString().includes(searchDate),
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
        .map(d => moment(d).toDate().toLocaleDateString())
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
                                current.toDate().toLocaleDateString(),
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
                            setSearchDateString(date?.toDate()?.toLocaleDateString() ?? '')
                        }}
                    />
                </div>
            </div>
            <Row gutter={[16, 16]}>
                {getReducedExerciseDetails(exerciseDetails, exerciseSearch, searchDateString)
                    .sort((e1, e2) => e1.name.localeCompare(e2.name))
                    .map((e, i) => {
                        const setsByDate = e.sets.reduce((memo, set) => {
                            const date = moment(set.date).toDate().toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })
                            memo[date] = [...(memo?.[date] ?? []), set]
                            return memo
                        }, {} as Record<string, ExerciseDetail['sets']>)
                        return (
                            <Col xs={{ span: 24 }} lg={{ span: 8 }} key={e.slugName}>
                                <Card title={e.name}>
                                    <Row>
                                        {Object.entries(setsByDate)
                                            .sort((t1, t2) => -1 * t1[0].localeCompare(t2[0]))
                                            .map(([date, sets]) => (
                                                <Col xs={{ span: 12 }} lg={{ span: 12 }} key={date}>
                                                    <Card title={date}>
                                                        {sets.map((s, idx) => (
                                                            <div key={idx}>
                                                                {s.reps} @{' '}
                                                                {e.bodyWeight ? 'you' : s.weight}
                                                            </div>
                                                        ))}
                                                    </Card>
                                                </Col>
                                            ))}
                                    </Row>
                                </Card>
                            </Col>
                        )
                    })}
            </Row>
        </>
    )
}

export default History
