import React, { ReactElement, useMemo } from 'react'
import {
  useCoinBalance,
  useCoinConfig,
  useCoinRates,
  useCurrency
} from 'blockchain-wallet-v4-frontend/src/hooks'

import { Exchange } from '@core'
import { fiatToString } from '@core/exchange/utils'

import { BuyButton } from '../../../BuyButton'
import { HoldingsCard } from '../../../HoldingsCard'
import { ReceiveButton } from '../../../ReceiveButton'
import { SellButton } from '../../../SellButton'
import { SendButton } from '../../../SendButton'
import { HoldingsCardHook } from './types'

export const useHoldingsCard: HoldingsCardHook = ({ coin }) => {
  const currency = useCurrency()
  const coinfig = useCoinConfig({ coin })

  const { data: coinBalance, isLoading: isCoinBalanceLoading } = useCoinBalance({ coin })

  const { data: rates, isLoading: isRatesLoading } = useCoinRates({ coin })

  const isLoading = useMemo(
    () => isCoinBalanceLoading || isRatesLoading,
    [isCoinBalanceLoading, isRatesLoading]
  )

  const actions: ReactElement[] = useMemo(() => {
    if (!coinBalance) return []

    const isBroke = coinBalance <= 0
    const isCustodialWalletBalance = coinfig.products.includes('CustodialWalletBalance')
    const isPrivateKey = coinfig.products.includes('PrivateKey')

    if (isCustodialWalletBalance && !isBroke) {
      // user can buy/sell and has a balance
      return [<BuyButton key={1} />, <SellButton key={2} />]
    }

    if (isCustodialWalletBalance && isBroke) {
      // user has a balance
      return [<BuyButton key={1} />, <ReceiveButton key={2} />]
    }

    if (isPrivateKey && isBroke) {
      // user cannot buy/sell
      return []
    }

    return [
      <SendButton key={1} onClick={() => null} disabled />,
      <ReceiveButton key={2} onClick={() => null} />
    ]
  }, [coinBalance, coinfig])

  const holdingsNode = useMemo(() => {
    if (isLoading) return <span>Loading</span>

    if (!rates || !coinBalance) return

    const totalFiatAmount = Exchange.convertCoinToFiat({
      coin,
      currency,
      isStandard: false,
      rates,
      value: coinBalance
    })

    const coinTotalAmount = Exchange.displayCoinToCoin({
      coin,
      isFiat: coinfig.type.name === 'FIAT',
      value: coinBalance
    })

    const totalFiatFormatted = fiatToString({ unit: currency, value: totalFiatAmount })

    return (
      <HoldingsCard
        total={totalFiatFormatted ?? ''}
        coinCode={coin}
        coinTotal={coinTotalAmount}
        actions={actions}
      />
    )
  }, [isLoading, rates, coinBalance, actions])

  return [holdingsNode]
}
