class AOP

	# Apply a "before" advice
	@before: (target, method, handler) ->

		originalMethod = target[ method ]

		target[ method ] = ->
			adviceArgs = AOP._prepareArgs( method, arguments )
			handler.apply this, adviceArgs
			originalMethod.apply this, arguments

	# Apply a "after" advice
	@after: (target, method, handler) ->

		originalMethod = target[ method ]

		target[ method ] = ->
			adviceArgs = AOP._prepareArgs( method, arguments )
			originalMethod.apply this, arguments
			handler.apply this, adviceArgs

	# Return a new array with args to apply on advices
	@_prepareArgs: (method, args) ->

		newArgs = [method]

		for arg in args
			newArgs.push arg

		newArgs