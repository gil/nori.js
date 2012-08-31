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

		newInstance = false
		instance = null

		if bean and bean.type
			if bean.singleton is false
				instance = @_proxifyClass( bean.type )
				newInstance = true
			else
				if @instances[beanName]
					instance = @instances[beanName]
				else
					instance = @instances[beanName] = @_proxifyClass( bean.type )
					newInstance = true

		if instance and newInstance
			@_applyConstructor( instance, bean )
			@_injectProperties( instance, bean )
			@_readAdvices( instance, bean )

		instance

	# Inject instance properties
	_injectProperties: (instance, bean) ->
		if bean.properties instanceof Array
			for property in bean.properties
				instance[property] = @instance(property)
		else if bean.properties instanceof Object
			for propertyName, beanName of bean.properties
				instance[propertyName] = @instance(beanName)

	# Read and apply AOP advices
	_readAdvices: (instance, bean) ->
		if bean.advices
			for advice in bean.advices
				AOP[advice.type]( instance, advice.method, @instance(advice.handler)[ advice.handlerMethod ] );

	# Proxy class, to allow applying constructor params
	BeanProxy: ->

	# Proxify class
	_proxifyClass: (clazz) ->
		@BeanProxy.prototype = clazz.prototype
		new @BeanProxy

	# Apply constructor arguments to given proxified instance
	_applyConstructor: (instance, bean) ->
		args = []

		if bean.constructor
			for arg in bean.constructor
				args.push @instance(arg)

		bean.type.apply(instance, args)

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
