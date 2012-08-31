class AOP

	# Apply a "before" advice, to be called before given method is called
	@before: (target, method, handler) ->

		originalMethod = target[ method ]

		target[ method ] = ->
			adviceArgs = AOP._prepareArgs( {method: method}, arguments )
			handler.apply this, adviceArgs
			originalMethod.apply this, arguments

	# Apply a "after" advice, to be called after given method is called
	@after: (target, method, handler) ->

		originalMethod = target[ method ]

		target[ method ] = ->
			adviceArgs = AOP._prepareArgs( {method: method}, arguments )
			originalMethod.apply this, arguments
			handler.apply this, adviceArgs

	# Apply a "afterThrow" advice, to be called if given method throws an unhandled exception
	@afterThrow: (target, method, handler) ->

		originalMethod = target[ method ]

		target[ method ] = ->
			try
				originalMethod.apply this, arguments
			catch exception

				adviceArgs = AOP._prepareArgs( {
					method: method,
					exception: exception
				}, arguments )

				handler.apply this, adviceArgs

	# Apply a "afterFinally" advice, to be called after given method is called, regardless of it's success
	@afterFinally: (target, method, handler) ->

		originalMethod = target[ method ]

		target[ method ] = ->
			try
				originalMethod.apply this, arguments
			finally
				adviceArgs = AOP._prepareArgs( {method: method}, arguments )
				handler.apply this, adviceArgs

	# Apply a "around" advice. This advice can control the method execution and change arguments, when needed.
	@around: (target, method, handler) ->

		originalMethod = target[ method ]

		target[ method ] = ->

			originalArgs = arguments

			adviceArgs = AOP._prepareArgs( {
				method: method,
				arguments: originalArgs,
				invoke: =>
					originalMethod.apply this, originalArgs

			}, arguments )

			handler.apply this, adviceArgs

	# Apply a "introduction" advice, that will replace given method.
	@introduction: (target, method, handler) ->

		target[ method ] = ->
			adviceArgs = AOP._prepareArgs( {method: method}, arguments )
			handler.apply this, adviceArgs

	# Return a new array with args to apply on advices
	@_prepareArgs: (adviceData, args) ->

		newArgs = [adviceData]

		for arg in args
			newArgs.push arg

		newArgs

# Using our AOP Class to implement Regular Expression support. Nice! ;)
methods = ["before", "after", "afterThrow", "afterFinally", "around", "introduction"]

for method in methods
	AOP.around AOP, method, (adviceData, target, method, handler) ->

		# Is "method" a RegExp?
		if method instanceof RegExp

			# For each target's method name
			for methodName of target

				# If it matches the RegExp, invoke advice with correct method name
				if methodName.match(method)
					adviceData.arguments[1] = methodName
					adviceData.invoke()

		else
			# It's not a RegExp, so just invoke it
			adviceData.invoke()
