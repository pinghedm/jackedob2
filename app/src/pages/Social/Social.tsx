import React, { useState } from 'react'
import { Switch, Button, Divider, Input, Typography, Spin, Row, Col } from 'antd'
import {
    useUserDetails,
    updateUserDetails,
    UserDetails,
    usePublicUsers,
} from 'services/user_service'
import { useMutation, useQueryClient } from 'react-query'
import History from 'pages/History/History.lazy'

interface UserSettingsProps {
    userDetails: UserDetails
}

const UserSettings = ({ userDetails }: UserSettingsProps) => {
    const queryClient = useQueryClient()
    const [displayName, setDisplayName] = useState(userDetails?.displayName ?? '')
    const [historyPublic, setHistoryPublic] = useState(userDetails?.historyPublic ?? false)

    const userDetailMutation = useMutation(
        () => updateUserDetails({ displayName, historyPublic }),
        {
            onMutate: async () => {
                await queryClient.cancelQueries(['userDetails'])
            },
            onSettled: () => {
                queryClient.invalidateQueries(['userDetails'])
            },
        },
    )

    return (
        <>
            <div
                style={{
                    width: '90%',
                    margin: 'auto',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '15px',
                    fontSize: '24px',
                }}>
                <Typography.Text style={{ display: 'inline-block' }}>Display Name:</Typography.Text>
                <Input
                    value={displayName}
                    onChange={e => {
                        setDisplayName(e.target.value)
                    }}
                    style={{ width: '45%' }}
                    placeholder="Display Name"
                />
            </div>
            <div
                style={{
                    width: '90%',
                    margin: '15px auto',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '15px',
                    fontSize: '24px',
                }}>
                <Typography.Text>Make my history data public</Typography.Text>{' '}
                <Switch
                    checked={historyPublic}
                    onChange={checked => {
                        setHistoryPublic(checked)
                    }}
                    style={{ marginTop: '8px' }}
                />
            </div>
            <div
                style={{
                    width: '90%',
                    margin: 'auto',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '15px',
                    fontSize: '24px',
                }}>
                <Button
                    type="primary"
                    style={{ width: '30%' }}
                    onClick={e => {
                        userDetailMutation.mutate()
                    }}>
                    Save
                </Button>
            </div>
        </>
    )
}

export interface SocialProps {}

const Social = ({}: SocialProps) => {
    const { data: userDetails, status } = useUserDetails()
    const { data: publicUsers } = usePublicUsers()
    const [selectedUser, setSelectedUser] = useState<null | UserDetails>(null)
    if (status !== 'success') {
        return <Spin />
    }
    return (
        <>
            <UserSettings
                userDetails={
                    userDetails || { displayName: '', historyPublic: false, email: '', uid: '' }
                }
            />
            <Divider />
            {(publicUsers?.length ?? 0) > 0 ? (
                <>
                    <Typography.Title level={4}>View Other Users</Typography.Title>
                    <Row>
                        {publicUsers?.map(u => (
                            <Col span={8} key={u.uid}>
                                <Button
                                    disabled={selectedUser?.uid === u.uid}
                                    style={{ width: '100%' }}
                                    onClick={e => {
                                        setSelectedUser(u)
                                    }}>
                                    {u.displayName} {`<${u.email}>`}
                                </Button>
                            </Col>
                        ))}
                    </Row>
                </>
            ) : null}
            {selectedUser ? (
                <>
                    <Divider />
                    <Typography.Title level={4}>
                        Viewing {selectedUser.displayName}
                    </Typography.Title>
                    <History uid={selectedUser.uid} />
                </>
            ) : null}
        </>
    )
}

export default Social
