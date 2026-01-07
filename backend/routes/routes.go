package routes

import (
	"THTINDOBAT/handler"

	"github.com/gin-gonic/gin"
)

func Register(r *gin.Engine, productHandler *handler.ProductHandler, orderHandler *handler.OrderHandler) {
	r.GET("/products", productHandler.List)
	r.POST("/products", productHandler.Create)
	r.POST("/order", orderHandler.Create)
}