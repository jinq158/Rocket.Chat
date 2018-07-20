import _ from 'underscore';

class ModelSessions extends RocketChat.models._Base {
	constructor() {
		super(...arguments);

		this.tryEnsureIndex({ 'year': 1, 'month': 1, 'day': 1, 'sessionId': 1 }, { unique: 1 });
		this.tryEnsureIndex({ 'sessionId': 1 });
		this.tryEnsureIndex({ 'sessionId': 1, 'userId': 1 });
	}

	createOrUpdate(data) {
		const { year, month, day, sessionId } = data;

		if (!sessionId) {
			return;
		}

		const now = new Date;

		return this.upsert({ year, month, day, sessionId }, {
			$set: data,
			$setOnInsert: {
				createdAt: now
			}
		});
	}

	updateBySessionIds(array, data) {
		const query = { sessionId: { $in: array } };

		const update = {
			$set: data
		};

		return this.update(query, update, { multi: true });
	}

	updateBySessionIdAndUserId(sessionId, userId, data = {}) {
		const query = { sessionId, userId };
		const update = {
			$set: data
		};

		return this.update(query, update, { multi: true });
	}
}

RocketChat.models.Sessions = new ModelSessions('sessions');