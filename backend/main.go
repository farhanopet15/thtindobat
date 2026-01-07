package main

import (
	"log"
	"os"

	"THTINDOBAT/config"
	"THTINDOBAT/handler"
	"THTINDOBAT/model"
	"THTINDOBAT/repository"
	"THTINDOBAT/routes"
	"THTINDOBAT/service"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	db, err := config.ConnectDB()
	if err != nil {
		log.Fatal("DB connect error:", err)
	}
	
	if err := db.AutoMigrate(&model.Product{}, &model.Order{}); err != nil {
		log.Fatal("AutoMigrate error:", err)
	}

	productRepo := repository.NewProductRepository(db)
	orderRepo := repository.NewOrderRepository(db)

	productSvc := service.NewProductService(productRepo)
	orderSvc := service.NewOrderService(db, orderRepo)

	productHandler := handler.NewProductHandler(productSvc)
	orderHandler := handler.NewOrderHandler(orderSvc)

	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	routes.Register(r, productHandler, orderHandler)

	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("Backend running on :" + port)
	r.Run(":" + port)
}
