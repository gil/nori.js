class AOP

	# Apply a before advice
	@before: (target, method, handler) ->

		old_method = target[ method ]

		target[ method ] = ->
			adviceArgs = AOP._prepareArgs( method, arguments )
			handler.apply this, adviceArgs
			old_method.apply this, arguments

	# Return a new array with args to apply on advices
	@_prepareArgs: (method, args) ->

		newArgs = [method]

		for arg in args
			newArgs.push arg

		newArgs