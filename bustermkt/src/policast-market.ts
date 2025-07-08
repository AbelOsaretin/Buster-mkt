import {
  Claimed as ClaimedEvent,
  MarketCreated as MarketCreatedEvent,
  MarketResolved as MarketResolvedEvent,
  MarketResolvedDetailed as MarketResolvedDetailedEvent,
  OwnerUpdated as OwnerUpdatedEvent,
  QuestionCreatorRoleGranted as QuestionCreatorRoleGrantedEvent,
  QuestionResolveRoleGranted as QuestionResolveRoleGrantedEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  SharesPurchased as SharesPurchasedEvent
} from "../generated/PolicastMarket/PolicastMarket"
import {
  Claimed,
  MarketCreated,
  MarketResolved,
  MarketResolvedDetailed,
  OwnerUpdated,
  QuestionCreatorRoleGranted,
  QuestionResolveRoleGranted,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  SharesPurchased
} from "../generated/schema"

export function handleClaimed(event: ClaimedEvent): void {
  let entity = new Claimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.marketId = event.params.marketId
  entity.user = event.params.user
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMarketCreated(event: MarketCreatedEvent): void {
  let entity = new MarketCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.marketId = event.params.marketId
  entity.question = event.params.question
  entity.optionA = event.params.optionA
  entity.optionB = event.params.optionB
  entity.endTime = event.params.endTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMarketResolved(event: MarketResolvedEvent): void {
  let entity = new MarketResolved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.marketId = event.params.marketId
  entity.outcome = event.params.outcome

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMarketResolvedDetailed(
  event: MarketResolvedDetailedEvent
): void {
  let entity = new MarketResolvedDetailed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.marketId = event.params.marketId
  entity.outcome = event.params.outcome
  entity.totalOptionAShares = event.params.totalOptionAShares
  entity.totalOptionBShares = event.params.totalOptionBShares
  entity.participantsLength = event.params.participantsLength

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnerUpdated(event: OwnerUpdatedEvent): void {
  let entity = new OwnerUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.prevOwner = event.params.prevOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleQuestionCreatorRoleGranted(
  event: QuestionCreatorRoleGrantedEvent
): void {
  let entity = new QuestionCreatorRoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleQuestionResolveRoleGranted(
  event: QuestionResolveRoleGrantedEvent
): void {
  let entity = new QuestionResolveRoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new RoleAdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.previousAdminRole = event.params.previousAdminRole
  entity.newAdminRole = event.params.newAdminRole

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new RoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new RoleRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSharesPurchased(event: SharesPurchasedEvent): void {
  let entity = new SharesPurchased(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.marketId = event.params.marketId
  entity.buyer = event.params.buyer
  entity.isOptionA = event.params.isOptionA
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
