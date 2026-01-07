package handler

import (
	"net/http"

	"THTINDOBAT/service"

	"github.com/gin-gonic/gin"
)

type ProductHandler struct {
	svc *service.ProductService
}

func NewProductHandler(svc *service.ProductService) *ProductHandler {
	return &ProductHandler{svc: svc}
}

func (h *ProductHandler) List(c *gin.Context) {
	products, err := h.svc.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "gagal ambil produk"})
		return
	}
	c.JSON(http.StatusOK, products)
}

type CreateProductBody struct {
	Name  string `json:"name"`
	Stock int    `json:"stock"`
	Price int    `json:"price"`
}

func (h *ProductHandler) Create(c *gin.Context) {
	var body CreateProductBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "body tidak valid"})
		return
	}

	if body.Name == "" || body.Stock < 0 || body.Price <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "input tidak valid"})
		return
	}

	p, err := h.svc.Create(body.Name, body.Stock, body.Price)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "gagal buat produk"})
		return
	}
	c.JSON(http.StatusCreated, p)
}