import React from 'react'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps } from 'redux-form'
import styled from 'styled-components'

import { fiatToString } from '@core/exchange/utils'
import { FiatType } from '@core/types'
import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { BankPartners } from 'data/types'

import { Props as OwnProps, SuccessStateType } from '.'

const CloseContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`
const Wrapper = styled(FlyoutWrapper)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`
const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const MainContentWrapper = styled(CenterWrapper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 32px 0 40px 0;
`
const IconContainer = styled.div`
  position: relative;
`
const Container = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: column;
  flex: 1;
`
const FiatIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const CheckIcon = styled.div`
  position: absolute;
  top: -15px;
  right: -15px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
  border-radius: 50%;
  background: ${(props) => props.theme.white};
`
const DescriptionText = styled(Text)`
  text-align: center;
`

type Props = OwnProps & SuccessStateType

const Success: React.FC<InjectedFormProps<Props> & Props> = (props) => {
  const coin = props.formValues?.currency || 'USD'
  const amount = props.formValues?.amount || 0
  const unit = (props.formValues?.currency as FiatType) || 'USD'
  const isOpenBanking = props.defaultMethod?.partner === BankPartners.YAPILY

  return (
    <Wrapper>
      <CloseContainer>
        <Icon
          cursor
          data-e2e='depositCloseModalIcon'
          name='close'
          size='20px'
          color='grey600'
          role='button'
          onClick={props.handleClose}
        />
      </CloseContainer>

      <Container>
        <CenterWrapper>
          <IconContainer>
            <FiatIcon>
              <Icon color={coin} name={coin} size='64px' />
            </FiatIcon>
            <CheckIcon>
              <Icon name='checkmark-circle-filled' color='green400' size='32px' />
            </CheckIcon>
          </IconContainer>
        </CenterWrapper>

        <MainContentWrapper>
          <Text color='grey800' size='20px' weight={600}>
            <FormattedMessage
              id='modals.brokerage.deposit_success.title'
              defaultMessage='{amount} Deposited!'
              values={{
                amount: fiatToString({
                  digits: 0,
                  unit,
                  value: amount
                })
              }}
            />
          </Text>
          <DescriptionText color='grey600' size='14px' weight={600}>
            <FormattedMessage
              id='modals.brokerage.deposit_success.wait_description'
              defaultMessage='While we wait for your bank to send the cash, here’s early access to {amount} in your {currency} Cash Account so you can buy crypto right away.'
              values={{
                amount: fiatToString({
                  digits: 0,
                  unit,
                  value: amount
                }),
                currency: coin
              }}
            />
          </DescriptionText>
          {!isOpenBanking && (
            <DescriptionText color='grey600' size='14px' weight={600} style={{ marginTop: '16px' }}>
              <FormattedMessage
                id='modals.brokerage.deposit_success.funds_available'
                defaultMessage='Your funds will be available to withdraw once the bank transfer is complete in 3-5 business days.'
              />
            </DescriptionText>
          )}
        </MainContentWrapper>

        <Button
          data-e2e='depositSuccessOk'
          height='48px'
          size='16px'
          nature='primary'
          onClick={props.handleClose}
          fullwidth
        >
          <Text weight={600} color='white'>
            <FormattedMessage id='buttons.ok' defaultMessage='OK' />
          </Text>
        </Button>
      </Container>
    </Wrapper>
  )
}

export default Success
