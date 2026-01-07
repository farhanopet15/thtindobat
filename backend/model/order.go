package model

import "time"

type Order struct {
	ID     uint    `json:"id" gorm:"primaryKey"`
	ProductID uint `json:"product_id" gorm:"not null;index"`
	Quantity int   `json:"quntity" gorm:"not null"`
	Discount int   `json:"discount" gorm:"not null"`
	TotalPrice int `json:"total_price" gorm:"not null"`
	CreatedAt time.Time `json:"created_at"`
	
	Product Product `json:"product" gorm:"foreignKey:ProductID"` 
}