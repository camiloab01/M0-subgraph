import {
  Approval as ApprovalEvent,
  AuthorizationCanceled as AuthorizationCanceledEvent,
  AuthorizationUsed as AuthorizationUsedEvent,
  EIP712DomainChanged as EIP712DomainChangedEvent,
  IndexUpdated as IndexUpdatedEvent,
  MToken,
  StartedEarning as StartedEarningEvent,
  StoppedEarning as StoppedEarningEvent,
  Transfer as TransferEvent,
} from '../generated/MToken/MToken'
import {
  Approval,
  AuthorizationCanceled,
  AuthorizationUsed,
  EIP712DomainChanged,
  IndexUpdated,
  StartedEarning,
  StoppedEarning,
  Transfer,
  Holder,
  DailyTokenStats,
} from '../generated/schema'
import { BigInt } from '@graphprotocol/graph-ts'

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account
  entity.spender = event.params.spender
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAuthorizationCanceled(
  event: AuthorizationCanceledEvent
): void {
  let entity = new AuthorizationCanceled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.authorizer = event.params.authorizer
  entity.nonce = event.params.nonce

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAuthorizationUsed(event: AuthorizationUsedEvent): void {
  let entity = new AuthorizationUsed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.authorizer = event.params.authorizer
  entity.nonce = event.params.nonce

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEIP712DomainChanged(
  event: EIP712DomainChangedEvent
): void {
  let entity = new EIP712DomainChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleIndexUpdated(event: IndexUpdatedEvent): void {
  let entity = new IndexUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.index = event.params.index
  entity.rate = event.params.rate

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStartedEarning(event: StartedEarningEvent): void {
  let entity = new StartedEarning(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStoppedEarning(event: StoppedEarningEvent): void {
  let entity = new StoppedEarning(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  //Map transfers first

  let entityTransfer = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entityTransfer.sender = event.params.sender
  entityTransfer.recipient = event.params.recipient
  entityTransfer.amount = event.params.amount

  entityTransfer.blockNumber = event.block.number
  entityTransfer.blockTimestamp = event.block.timestamp
  entityTransfer.transactionHash = event.transaction.hash

  entityTransfer.save()

  // Map Holders

  // Update sender's balance
  let senderId = event.params.sender
  if (senderId.toHex() != '0x0000000000000000000000000000000000000000') {
    let sender = Holder.load(senderId)
    if (!sender) {
      sender = new Holder(senderId)
      sender.balance = BigInt.zero()
    }
    sender.balance = sender.balance.minus(event.params.amount)
    sender.save()
  }

  // Update recipient's balance
  let recipientId = event.params.recipient
  let recipient = Holder.load(recipientId)
  if (!recipient) {
    recipient = new Holder(recipientId)
    recipient.balance = BigInt.zero()
  }
  recipient.balance = recipient.balance.plus(event.params.amount)
  recipient.save()

  // Map Daily volume

  // Get the current day (block timestamp to date)
  let timestamp = event.block.timestamp.toI32()
  let date = new Date(timestamp * 1000) // Convert to milliseconds
  let dayId = date.toISOString().split('T')[0] // Format as YYYY-MM-DD

  let dailyStats = DailyTokenStats.load(dayId)
  if (!dailyStats) {
    dailyStats = new DailyTokenStats(dayId)
    dailyStats.date = dayId
    dailyStats.dailyVolume = BigInt.zero()
    dailyStats.tokenSupply = BigInt.zero()
  }

  dailyStats.dailyVolume = dailyStats.dailyVolume.plus(event.params.amount)

  let tokenContract = MToken.bind(event.address)
  let totalSupply = tokenContract.try_totalSupply()

  if (!totalSupply.reverted) {
    dailyStats.tokenSupply = totalSupply.value
  }

  dailyStats.save()
}
