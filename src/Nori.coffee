class Nori

	constructor: ->
		@beans = []
		@instances = {}

	# Add many beans at once
	addBeans: (beans) ->
		@addBean bean for bean in beans

	# Add single bean
	addBean: (bean) ->

		# Remove old bean, when duplicate
		oldBean = @_beanByName(bean.name)

		if oldBean
			oldBeanIndex = @beans.indexOf oldBean
			@beans.splice oldBeanIndex, 1

		# Store new bean
		@beans.push bean

	# Return the instance of a bean
	instance: (beanName) ->
		bean = @_beanByName beanName

		if bean and bean.type
			if bean.singleton == false
				return @_newInstance bean
			else
				@instances[beanName] = @_newInstance(bean) unless @instances[beanName]
				return @instances[beanName]

		null

	# Instantiate bean
	_newInstance: (bean) ->
		constructorParams = []

		# Get instances for constructor params
		if bean.constructor
			for param in bean.constructor
				constructorParams.push @instance(param)

		# Apply constructor params to new instance
		instance = @_proxifyClass(bean.type, constructorParams)

		# Set instance properties
		if bean.properties instanceof Array
			for property in bean.properties
				instance[property] = @instance(property)
		else if bean.properties instanceof Object
			for propertyName, beanName of bean.properties
				instance[propertyName] = @instance(beanName)

		# Read and apply AOP advices
		if bean.advices
			for advice in bean.advices
				AOP[advice.type]( instance, advice.method, @instance(advice.handler)[ advice.handlerMethod ] );

		instance

	# Proxy class, to allow applying constructor params
	BeanProxy: ->

	# Proxify class while applying given params to constructor
	_proxifyClass: (clazz, params) ->
		@BeanProxy.prototype = clazz.prototype
		instance = new @BeanProxy
		clazz.apply(instance, params)
		instance

	# Find bean by name
	_beanByName: (beanName) ->
		foundBean = null

		for bean in @beans
			foundBean = bean if bean.name == beanName

		foundBean

	# AOP support
	Nori.AOP = AOP

	# Global Nori reference
	oldNori = window.Nori
	window.Nori = Nori

	# Return Nori reference and restore global one
	@noConflict: ->
		window.Nori = oldNori
		Nori
