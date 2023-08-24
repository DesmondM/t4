import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Stack } from '@fluentui/react'
import { TkBorderedStack, TkButtonCaution, TkCheckbox, TkMessageBar, TkPrimaryButton, TkText, TkText400, TkText500, TkTextLabel } from '../../ToolkitControls'
import { fetchProjectSamples, addToolkitSamplesToApp } from '../../../reducers/projectSlice'
import { publishObjectChanged } from '../../../reducers/publishMonitorSlice'
import { splitCamelCaseString } from '../../../utils/utilities'

export default function SampleSettings(props) {
    const {
        project
    } = props

    const projectStateApp = useSelector(state => state.project.app)
    const authHeader = useSelector(state => state.login.authHeader)
    const samples = useSelector(state => state.project.samples)
    const groupSamples = useSelector(state => state.project.groupSamples)
    const itemSamples = useSelector(state => state.project.itemSamples)
    const [changesMade, setChangesMade] = useState(false)
    const [addedSamples, setAddedSamples] = useState([])
    const [itemsArray, setItemsArray] = useState([])
    const [error, setError] = useState(null)
    const dispatch = useDispatch()

    useEffect(_ => {
        dispatch(fetchProjectSamples(project.Name))
    }, [])

    const { data } = samples ?? {}
    useEffect(() => {
        if (data) {
            const keys = Object.keys(data)
            setItemsArray(keys.map((key) => data[key]?.Name))
        }
    }, [data])

    if (samples.error) {
        const msg = samples.error.message ?? 'Unexpected ###### error occurred fetching theme data'
        return (
            <Stack tokens={{ padding: 20 }}>
                <TkMessageBar messageBarType={1}>
                    <TkText400>{msg}</TkText400>
                </TkMessageBar>
            </Stack>
        )
    } else if (projectStateApp.fetching) {
        return (
            <Stack tokens={{ padding: 20 }}>
                <TkText400>Loading........###########</TkText400>
            </Stack>
        )
    }

    console.log('RENDERING: SampleSettings')
    return (
        <Stack grow tokens={{ padding: 10, childrenGap: 20 }}
            styles={{ root: { overflow: 'hidden' } }}
        >
            <Stack grow tokens={{ childrenGap: 10 }} styles={{ root: { overflow: 'auto' } }}>
                <TkBorderedStack tokens={{ padding: 10, childrenGap: 0 }} styles={{ root: { margin: 10 } }}>
                    <Stack tokens={{ padding: 10 }}>
                        <TkTextLabel variant='medium'>Group Samples</TkTextLabel>
                    </Stack>
                    <Stack> <TkText400>{itemSamples.fetching && <Stack>Loading........</Stack>}</TkText400>
                        <Stack tokens={{ padding: 10 }} styles={{ root: { background: 'white', borderRadius: 5 } }}>
                            {data && renderGroupSamples()}
                        </Stack><Stack styles={{ root: { overflow: 'auto' } }}>
                        </Stack>
                       
                        <Stack tokens={{ padding: 10 }}>
                            <TkTextLabel variant='medium'>Select Sample to Add</TkTextLabel>
                        </Stack><Stack tokens={{ padding: 10 }} styles={{ root: { background: 'white', borderRadius: 5 } }}>
                            {data && renderSamplesToAdd()}
                        </Stack></Stack>

                        <Stack tokens={{ padding: 10 }}>
                            <TkTextLabel variant='medium'>Features Included in the Project</TkTextLabel>
                        </Stack>
                        <Stack tokens={{ padding: 10 }} styles={{ root: { background: 'white', borderRadius: 5 } }}>
                            {data && renderSamplesIncluded()}
                        </Stack>                </TkBorderedStack>
            </Stack >
            <Stack tokens={{ padding: 20, childrenGap: 10 }} >
                <Stack>
                    {
                        error &&
                        <TkMessageBar messageBarType={1}>
                            <TkText>{error}</TkText>
                        </TkMessageBar>
                    }
                </Stack>
                <Stack styles={{ root: { height: 16 } }}>
                </Stack>
                <Stack horizontal horizontalAlign='space-between'>
                    <TkButtonCaution text='Discard' disabled={!changesMade} />
                    <TkPrimaryButton text='Save' disabled={!changesMade} onClick={addSamples} />
                </Stack>
            </Stack>
        </Stack>
    )

    function handleAddSample(additionalSample) {
        const isSampleAdded = addedSamples.includes(additionalSample);
        if (isSampleAdded) {
            const updatedList = addedSamples.filter(sample => sample !== additionalSample);
            setAddedSamples(updatedList);
            setChangesMade(true)
        } else {
            const updatedList = [...addedSamples, additionalSample];
            setAddedSamples(updatedList);
            setChangesMade(true)
        }
    }

    function addSamples() {
        const sampleList = addedSamples
        addToolkitSamplesToApp(authHeader, project.Name, sampleList, (res, error) => {
            console.log(res, error)
            if (res) {
                dispatch(publishObjectChanged(project.Name))
                dispatch(fetchProjectSamples(project.Name))
                setAddedSamples([]);
            } else {
                const msg = error.message ?? 'Unexpected error occurred during the update.'
                setError(msg)

            }
        })
        setChangesMade(false)
    }

    function renderGroupSamples() {
        return (
            <Stack wrap horizontal tokens={{ childrenGap: 20 }} verticalAlign="start" style={{ justifyContent: 'flex-start' }}>
                {Object.keys(groupSamples).map((key) => (
                    (itemsArray.includes(key)) ?
                        <TkCheckbox label={splitCamelCaseString(key)} checked={true} disabled={true} styles={{ root: { width: 180 } }} />
                        :
                        <TkCheckbox label={splitCamelCaseString(key)} onChange={() => handleAddSample(key)} styles={{ root: { width: 180 } }} />
                ))}
            </Stack>
        )
    }

    function renderSamplesIncluded() {
        return (
            <Stack wrap horizontalAlign='start' horizontal tokens={{ childrenGap: 20 }} verticalAlign='start' style={{ width: '100%' }}>
                {Object.keys(data).map((key) => {
                    const dataElement = data[key]
                    if (itemsArray.includes(dataElement?.Name))
                        return (
                            <TkCheckbox label={splitCamelCaseString(dataElement?.Name)} checked={true} disabled={true} styles={{ root: { width: 180 } }} />

                        );
                })}
            </Stack>
        )
    }

    function renderSamplesToAdd() {
        return (
            <Stack wrap horizontalAlign='start' horizontal tokens={{ childrenGap: 20 }} verticalAlign='start' style={{ width: '100%' }}>
                {Object.keys(itemSamples).map((key) => {
                    if (!itemsArray.includes(key))
                        return <TkCheckbox label={splitCamelCaseString(key)} onChange={() => handleAddSample(key)} styles={{ root: { width: 180 } }} />
                })}
            </Stack>
        )
    }
}
